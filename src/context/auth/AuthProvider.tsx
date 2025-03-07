
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, User, Profile, SignInResponse, SignUpOptions } from './types';
import { fetchProfile, setupAvatarBucket } from './authUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Public method to refresh the profile
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    // Initialize avatar bucket
    setupAvatarBucket();
    
    // Check active session
    const getSession = async () => {
      try {
        // Optimize session check with a timeout to prevent long waits
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timed out')), 3000)
        );
        
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise])
          .then(result => result as Awaited<ReturnType<typeof supabase.auth.getSession>>)
          .catch(error => {
            console.error('Session check timed out:', error);
            return { data: null, error };
          });
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setProfile(null);
        } else if (data?.session?.user) {
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email || '',
          };
          
          setUser(userData);
          
          // Fetch user profile
          fetchProfile(userData.id).then(profileData => {
            setProfile(profileData);
          });
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
          };
          
          setUser(userData);
          
          // Fetch profile when auth state changes
          fetchProfile(userData.id).then(profileData => {
            setProfile(profileData);
          });
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
        setInitialized(true);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data?.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
        };
        
        setUser(userData);
        
        // Fetch profile after sign in
        const profileData = await fetchProfile(userData.id);
        setProfile(profileData);
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        return { user: userData };
      }
      
      return {};
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    options?: SignUpOptions
  ): Promise<SignInResponse> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: options?.username,
          },
        },
      });

      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data?.user) {
        // Note: we don't set the user here because Supabase might require email verification
        toast({
          title: "Conta criada com sucesso",
          description: "Você já pode fazer login.",
        });
        return { user: {
          id: data.user.id,
          email: data.user.email || '',
        }};
      }
      
      return {};
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      initialized,
      signIn,
      signUp,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
