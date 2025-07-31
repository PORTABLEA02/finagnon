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
    detectSessionInUrl: true,
    storage: {
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Error getting item from storage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting item in storage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing item from storage:', error);
        }
      }
    }
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
  try {
    console.log('Fetching user profile for:', userId);
    
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.error('Error fetching user profile:', error);
    return null;
  }

    console.log('User profile fetched successfully:', data.email);
    
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
  } catch (error) {
    console.error('Exception in getUserProfile:', error);
    return null;
  }
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

// Fonction pour vérifier si un email existe déjà
export async function checkEmailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking email:', error);
    return false;
  }

  return !!data;
}

// Fonction pour réinitialiser le mot de passe
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset exception:', error);
    return { success: false, error: 'Erreur lors de la réinitialisation' };
  }
}