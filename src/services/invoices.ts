import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Invoice = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];
type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];
type InvoiceItemInsert = Database['public']['Tables']['invoice_items']['Insert'];
type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];

export class InvoiceService {
  // Récupérer toutes les factures
  static async getAll(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patient:patients(first_name, last_name, phone),
        appointment:appointments(reason),
        invoice_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer une facture par ID
  static async getById(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patient:patients(first_name, last_name, phone, email, address),
        appointment:appointments(reason),
        invoice_items(*),
        payments(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching invoice:', error);
      return null;
    }

    return data;
  }

  // Créer une nouvelle facture
  static async create(
    invoiceData: Omit<InvoiceInsert, 'id'>, 
    items: Omit<InvoiceItemInsert, 'invoice_id'>[]
  ): Promise<Invoice> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Générer un ID de facture
    const invoiceId = await this.generateInvoiceId();
    
    // Créer la facture
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        ...invoiceData,
        id: invoiceId,
        created_by: user?.id
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      throw invoiceError;
    }

    // Ajouter les éléments de facture
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(
        items.map(item => ({
          ...item,
          invoice_id: invoiceId
        }))
      );

    if (itemsError) {
      console.error('Error creating invoice items:', itemsError);
      throw itemsError;
    }

    return invoice;
  }

  // Mettre à jour une facture
  static async update(id: string, updates: InvoiceUpdate): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }

    return data;
  }

  // Supprimer une facture
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Ajouter un paiement
  static async addPayment(payment: PaymentInsert): Promise<Payment> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ...payment,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding payment:', error);
      throw error;
    }

    // Mettre à jour le statut de la facture si entièrement payée
    const { data: invoice } = await supabase
      .from('invoices')
      .select('total')
      .eq('id', payment.invoice_id)
      .single();

    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('invoice_id', payment.invoice_id);

    const totalPaid = (payments || []).reduce((sum, p) => sum + p.amount, 0);
    
    if (invoice && totalPaid >= invoice.total) {
      await supabase
        .from('invoices')
        .update({ 
          status: 'paid', 
          payment_method: payment.payment_method,
          paid_at: new Date().toISOString()
        })
        .eq('id', payment.invoice_id);
    }

    return data;
  }

  // Générer un ID de facture unique
  static async generateInvoiceId(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Récupérer le dernier numéro de facture pour ce mois
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .like('id', `INV-${year}-${month}%`)
      .order('id', { ascending: false })
      .limit(1);

    let nextNumber = 1;
    if (data && data.length > 0) {
      const lastId = data[0].id;
      const lastNumber = parseInt(lastId.split('-')[3]) || 0;
      nextNumber = lastNumber + 1;
    }

    return `INV-${year}-${month}${String(nextNumber).padStart(3, '0')}`;
  }

  // Récupérer les statistiques de facturation
  static async getBillingStats() {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('total, status, created_at');

    if (error) {
      console.error('Error fetching billing stats:', error);
      throw error;
    }

    const totalRevenue = invoices?.reduce((sum, inv) => sum + inv.total, 0) || 0;
    const paidAmount = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0) || 0;
    const pendingAmount = invoices?.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0) || 0;
    const overdueAmount = invoices?.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0) || 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = invoices?.filter(inv => {
      const invDate = new Date(inv.created_at);
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
    }).reduce((sum, inv) => sum + inv.total, 0) || 0;

    return {
      totalRevenue,
      paidAmount,
      pendingAmount,
      overdueAmount,
      monthlyRevenue,
      totalInvoices: invoices?.length || 0,
      paidInvoices: invoices?.filter(inv => inv.status === 'paid').length || 0
    };
  }
}