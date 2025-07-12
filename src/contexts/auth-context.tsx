"use client";

import { createClientComponentClient } from '@/lib/supabase/client';
import { User } from '@/types/contexts';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

// Get app name from environment variables with a fallback
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'whatssummarize';
const AUTH_TOKEN_KEY = `${APP_NAME}_authToken`;
const USER_DATA_KEY = `${APP_NAME}_userData`;
const REMEMBER_ME_KEY = `${APP_NAME}_rememberMe`;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  rememberMe: boolean;
  login: (token: string, userData: User, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedRememberMe = localStorage.getItem(REMEMBER_ME_KEY);
      if (storedRememberMe === 'true') {
        setRememberMe(true);
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUserData = localStorage.getItem(USER_DATA_KEY);
        
        if (storedToken && storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error loading stored auth data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        const userData = mapSupabaseUserToUser(session.user);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store in localStorage if remember me is enabled
        if (rememberMe) {
          localStorage.setItem(AUTH_TOKEN_KEY, session.access_token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        if (!rememberMe) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_DATA_KEY);
          localStorage.removeItem(REMEMBER_ME_KEY);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth, rememberMe]);

  // Helper to map Supabase user to our User type
  const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || 
            supabaseUser.user_metadata?.name || 
            supabaseUser.email?.split('@')[0] ||
            'User',
      avatar: supabaseUser.user_metadata?.avatar_url || 
              supabaseUser.user_metadata?.picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email || 'U')}`,
      // Add any additional fields you need
    };
  };

  const login = useCallback(async (token: string, userData: User, rememberMeFlag?: boolean): Promise<boolean> => {
    try {
      const shouldRemember = rememberMeFlag ?? rememberMe;
      setRememberMe(shouldRemember);
      
      if (shouldRemember) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, [rememberMe]);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      // Always clear localStorage on logout
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
      
      setUser(null);
      setIsAuthenticated(false);
      setRememberMe(false);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }, [supabase.auth]);

  const updateUser = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = { ...user, ...updates };
      if (rememberMe) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
  }, [user, rememberMe]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }, [supabase.auth]);

  const signInWithGithub = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  }, [supabase.auth]);

  const signInWithEmail = useCallback(async (email: string, password: string, rememberMeFlag?: boolean) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && rememberMeFlag !== undefined) {
        setRememberMe(rememberMeFlag);
        if (rememberMeFlag) {
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
        } else {
          localStorage.removeItem(REMEMBER_ME_KEY);
        }
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in with email:', error);
      return { error: error as Error };
    }
  }, [supabase.auth]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    } catch (error) {
      console.error('Error signing up with email:', error);
      return { error: error as Error };
    }
  }, [supabase.auth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        rememberMe,
        login,
        logout,
        updateUser,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
