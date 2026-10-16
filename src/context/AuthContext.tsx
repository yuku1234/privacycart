/**
 * PrivacyCart — Authentication Context
 * SPPU Third-Year Computer Engineering Project
 * 
 * Supports both:
 * 1. Supabase Auth (when credentials exist in .env)
 * 2. Academic Demo Auth (with preloaded personas for viva demonstration)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { localStore } from '../lib/storage';
import { DEMO_USERS } from '../lib/demoData';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isCloudAuth: boolean;
  isAdmin: boolean;
  login: (email: string, passwordPlain: string) => Promise<void>;
  register: (params: {
    fullName: string;
    email: string;
    passwordPlain: string;
    phone?: string;
    marketingConsent: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoAccount: (preset: 'alice' | 'bob' | 'admin') => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'privacycart_active_user_id';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCloudAuth] = useState<boolean>(isSupabaseConfigured());

  // Restore session
  const initializeAuth = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              phone: profile.phone,
              role: (profile.role as UserRole) || 'user',
              createdAt: profile.created_at,
            });
          }
        }
      } else {
        // Local Demo Mode
        const storedUserId = typeof window !== 'undefined'
          ? localStorage.getItem(CURRENT_USER_STORAGE_KEY)
          : null;

        if (storedUserId === 'guest') {
          setUser(null);
        } else if (storedUserId) {
          const profile = localStore.getUserById(storedUserId);
          if (profile) {
            setUser(profile);
          } else {
            // Default to Alice for viva demonstration
            const alice = localStore.getUserById('usr-alice-101');
            setUser(alice);
            if (alice && typeof window !== 'undefined') {
              localStorage.setItem(CURRENT_USER_STORAGE_KEY, alice.id);
            }
          }
        } else {
          // Default to Alice on fresh first-time visit
          const alice = localStore.getUserById('usr-alice-101');
          setUser(alice);
          if (alice && typeof window !== 'undefined') {
            localStorage.setItem(CURRENT_USER_STORAGE_KEY, alice.id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to initialize session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                fullName: profile.full_name,
                phone: profile.phone,
                role: (profile.role as UserRole) || 'user',
                createdAt: profile.created_at,
              });
            }
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [initializeAuth]);

  const login = async (email: string, passwordPlain: string): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordPlain,
      });
      if (error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      return;
    }

    // Local Demo Login
    const authenticated = localStore.authenticate(email, passwordPlain);
    setUser(authenticated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, authenticated.id);
    }
  };

  const register = async (params: {
    fullName: string;
    email: string;
    passwordPlain: string;
    phone?: string;
    marketingConsent: boolean;
  }): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.passwordPlain,
        options: {
          data: {
            full_name: params.fullName,
            phone: params.phone,
            marketing_consent: params.marketingConsent,
          },
        },
      });

      if (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }

      if (data.user) {
        // Create initial profile and consents in database
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: params.email,
          full_name: params.fullName,
          phone: params.phone,
          role: 'user',
        });
      }
      return;
    }

    // Local Demo Registration
    const newUser = localStore.register(params);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, newUser.id);
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(`Logout failed: ${error.message}`);
      }
    }

    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, 'guest');
    }
  };

  const switchDemoAccount = (preset: 'alice' | 'bob' | 'admin'): void => {
    let targetProfile: UserProfile | null = null;
    if (preset === 'alice') {
      targetProfile = localStore.getUserById(DEMO_USERS['user-alice'].id);
    } else if (preset === 'bob') {
      targetProfile = localStore.getUserById(DEMO_USERS['user-bob'].id);
    } else if (preset === 'admin') {
      targetProfile = localStore.getUserById(DEMO_USERS['admin-sharma'].id);
    }

    if (targetProfile) {
      setUser(targetProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, targetProfile.id);
      }
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;
    if (isSupabaseConfigured() && supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          phone: profile.phone,
          role: profile.role as UserRole,
          createdAt: profile.created_at,
        });
      }
    } else {
      const refreshed = localStore.getUserById(user.id);
      if (refreshed) {
        setUser(refreshed);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isCloudAuth,
        isAdmin,
        login,
        register,
        logout,
        switchDemoAccount,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
