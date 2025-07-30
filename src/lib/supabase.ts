import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types pour l'authentification
export type AuthUser = {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'secretary';
  firstName: string;
  lastName: string;
  speciality?: string;
  phone: string;
  isActive: boolean;
};

// Fonction pour obtenir le profil utilisateur complet
export async function getUserProfile(userId: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    firstName: data.first_name,
    lastName: data.last_name,
    speciality: data.speciality || undefined,
    phone: data.phone,
    isActive: data.is_active
  };
}

// Fonction pour créer un profil utilisateur après inscription
export async function createUserProfile(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  role: 'admin' | 'doctor' | 'secretary',
  phone: string,
  speciality?: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      phone,
      speciality,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data;
}

// Fonction pour vérifier les permissions
export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

// Fonction pour obtenir les utilisateurs par rôle
export async function getUsersByRole(role?: 'admin' | 'doctor' | 'secretary') {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .order('first_name');

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }

  return data;
}