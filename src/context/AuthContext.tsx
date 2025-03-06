
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  // Função pública para recarregar o perfil quando necessário
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  // Efeito para inicialização e limpeza
  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    let mounted = true;

    // Função para buscar e atualizar o perfil
    const updateProfile = async (userId: string) => {
      if (!mounted) return;
      const data = await fetchProfile(userId);
      if (mounted) setProfile(data);
    };

    // Função para atualizar estado do usuário
    const updateUserState = async (newSession: Session | null) => {
      if (!mounted) return;
      
      console.log("Auth state update:", newSession ? "User logged in" : "No user");
      
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await updateProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    };

    // Inicializar sessão
    const initSession = async () => {
      try {
        console.log("Getting initial session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao inicializar sessão:', error);
          throw error;
        }
        
        console.log("Initial session result:", session ? "Session found" : "No session");
        await updateUserState(session);
      } catch (error) {
        console.error('Erro ao inicializar sessão:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          console.log("Initial auth loading complete");
          setLoading(false);
        }
      }
    };

    // Iniciar sessão
    initSession();

    // Configurar listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        if (!mounted) return;
        await updateUserState(session);
      }
    );

    return () => {
      console.log("AuthProvider: Cleaning up");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); 

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro ao fazer login:', error);
        return { error };
      }

      // Aguardar a atualização do estado antes de prosseguir
      await new Promise(resolve => setTimeout(resolve, 500));
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
      }

      // Limpar estados locais
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
