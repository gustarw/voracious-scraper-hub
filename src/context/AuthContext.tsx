
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
}

interface SignInResponse {
  user?: User;
  error?: Error;
}

interface SignUpOptions {
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
        } else if (data?.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        setUser(null);
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
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else {
          setUser(null);
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
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        return { user: data.user as User };
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
        return { user: data.user as User };
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
      loading,
      initialized,
      signIn,
      signUp,
      signOut
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
