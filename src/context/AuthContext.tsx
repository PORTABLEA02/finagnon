import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, getUserProfile, AuthUser } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    role: 'admin' | 'doctor' | 'secretary';
    phone: string;
    speciality?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          // Récupérer le profil utilisateur complet
          const userProfile = await getUserProfile(session.user.id);
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      
      if (session?.user) {
        // Récupérer le profil utilisateur complet
        const userProfile = await getUserProfile(session.user.id);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        // Le profil sera récupéré automatiquement par onAuthStateChange
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      firstName: string;
      lastName: string;
      role: 'admin' | 'doctor' | 'secretary';
      phone: string;
      speciality?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      // Créer le compte utilisateur
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            phone: userData.phone,
            speciality: userData.speciality
          }
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Créer le profil utilisateur dans la table profiles
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email.trim(),
              first_name: userData.firstName,
              last_name: userData.lastName,
              role: userData.role,
              phone: userData.phone,
              speciality: userData.speciality,
              is_active: true
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            return { success: false, error: 'Erreur lors de la création du profil' };
          }

          return { success: true };
        } catch (profileError) {
          console.error('Profile creation exception:', profileError);
          return { success: false, error: 'Erreur lors de la création du profil' };
        }
      }

      return { success: false, error: 'Erreur inconnue lors de la création du compte' };
    } catch (error) {
      console.error('SignUp exception:', error);
      return { success: false, error: 'Erreur lors de la création du compte' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Les états seront mis à jour automatiquement par onAuthStateChange
    } catch (error) {
      console.error('Logout exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!session,
    login,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}