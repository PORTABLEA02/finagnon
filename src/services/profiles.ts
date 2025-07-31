import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  // Récupérer tous les profils
  static async getAll(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer les profils par rôle
  static async getByRole(role: 'admin' | 'doctor' | 'secretary'): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .eq('is_active', true)
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error fetching profiles by role:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer un profil par ID
  static async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  // Mettre à jour un profil
  static async update(id: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }

  // Récupérer les médecins avec leurs spécialités
  static async getDoctors(): Promise<Profile[]> {
    return this.getByRole('doctor');
  }

  // Récupérer les statistiques des profils
  static async getStats() {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('role, is_active');

    if (error) {
      console.error('Error fetching profile stats:', error);
      throw error;
    }

    const total = profiles?.length || 0;
    const active = profiles?.filter(p => p.is_active).length || 0;
    const doctors = profiles?.filter(p => p.role === 'doctor').length || 0;
    const admins = profiles?.filter(p => p.role === 'admin').length || 0;
    const secretaries = profiles?.filter(p => p.role === 'secretary').length || 0;

    return {
      total,
      active,
      inactive: total - active,
      doctors,
      admins,
      secretaries
    };
  }
}