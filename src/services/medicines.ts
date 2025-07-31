import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Medicine = Database['public']['Tables']['medicines']['Row'];
type MedicineInsert = Database['public']['Tables']['medicines']['Insert'];
type MedicineUpdate = Database['public']['Tables']['medicines']['Update'];
type StockMovement = Database['public']['Tables']['stock_movements']['Row'];
type StockMovementInsert = Database['public']['Tables']['stock_movements']['Insert'];

export class MedicineService {
  // Récupérer tous les médicaments
  static async getAll(): Promise<Medicine[]> {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les médicaments par catégorie
  static async getByCategory(category: string): Promise<Medicine[]> {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching medicines by category:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les médicaments avec stock faible
  static async getLowStock(): Promise<Medicine[]> {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .filter('current_stock', 'lte', 'min_stock')
      .order('current_stock', { ascending: true });

    if (error) {
      console.error('Error fetching low stock medicines:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les médicaments expirant bientôt
  static async getExpiringSoon(days: number = 90): Promise<Medicine[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .lte('expiry_date', futureDate.toISOString().split('T')[0])
      .gte('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error) {
      console.error('Error fetching expiring medicines:', error);
      throw error;
    }

    return data || [];
  }

  // Créer un nouveau médicament
  static async create(medicine: MedicineInsert): Promise<Medicine> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('medicines')
      .insert({
        ...medicine,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }

    return data;
  }

  // Mettre à jour un médicament
  static async update(id: string, updates: MedicineUpdate): Promise<Medicine> {
    const { data, error } = await supabase
      .from('medicines')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }

    return data;
  }

  // Supprimer un médicament
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  }

  // Rechercher des médicaments
  static async search(query: string): Promise<Medicine[]> {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .or(`name.ilike.%${query}%,manufacturer.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching medicines:', error);
      throw error;
    }

    return data || [];
  }

  // Ajouter un mouvement de stock
  static async addStockMovement(movement: StockMovementInsert): Promise<StockMovement> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('stock_movements')
      .insert({
        ...movement,
        user_id: user?.id || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding stock movement:', error);
      throw error;
    }

    return data;
  }

  // Récupérer l'historique des mouvements de stock
  static async getStockMovements(medicineId?: string): Promise<StockMovement[]> {
    let query = supabase
      .from('stock_movements')
      .select(`
        *,
        medicine:medicines(name),
        user:profiles!user_id(first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (medicineId) {
      query = query.eq('medicine_id', medicineId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stock movements:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les statistiques d'inventaire
  static async getInventoryStats() {
    const { data: medicines, error } = await supabase
      .from('medicines')
      .select('*');

    if (error) {
      console.error('Error fetching inventory stats:', error);
      throw error;
    }

    const totalItems = medicines?.length || 0;
    const lowStockItems = medicines?.filter(m => m.current_stock <= m.min_stock).length || 0;
    const totalValue = medicines?.reduce((sum, m) => sum + (m.current_stock * m.unit_price), 0) || 0;
    
    const expiringSoon = medicines?.filter(m => {
      const daysToExpiry = Math.ceil(
        (new Date(m.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
      );
      return daysToExpiry <= 90 && daysToExpiry > 0;
    }).length || 0;

    return {
      totalItems,
      lowStockItems,
      expiringSoon,
      totalValue
    };
  }
}