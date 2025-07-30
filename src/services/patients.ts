import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Patient = Database['public']['Tables']['patients']['Row'];
type PatientInsert = Database['public']['Tables']['patients']['Insert'];
type PatientUpdate = Database['public']['Tables']['patients']['Update'];

export class PatientService {
  // Récupérer tous les patients
  static async getAll(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer un patient par ID
  static async getById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching patient:', error);
      return null;
    }

    return data;
  }

  // Créer un nouveau patient
  static async create(patient: PatientInsert): Promise<Patient> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('patients')
      .insert({
        ...patient,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating patient:', error);
      throw error;
    }

    return data;
  }

  // Mettre à jour un patient
  static async update(id: string, updates: PatientUpdate): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating patient:', error);
      throw error;
    }

    return data;
  }

  // Supprimer un patient
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  // Rechercher des patients
  static async search(query: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error searching patients:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les patients avec leur historique médical
  static async getWithMedicalHistory(patientId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        medical_records (
          *,
          prescriptions (*),
          profiles:doctor_id (first_name, last_name, speciality)
        )
      `)
      .eq('id', patientId)
      .single();

    if (error) {
      console.error('Error fetching patient with medical history:', error);
      throw error;
    }

    return data;
  }
}