
/**
 * Contexto de Autenticação para o Voracious Scraper Hub
 * 
 * Este módulo fornece um contexto React para gerenciar o estado de autenticação
 * e perfil do usuário usando o Supabase como provedor de autenticação.
 * 
 * @module AuthContext
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";

/**
 * Tipo que representa o perfil do usuário
 */
type Profile = {
  /** ID único do perfil, igual ao ID do usuário no Supabase */
  id: string;
  /** Nome de usuário escolhido pelo usuário */
  username: string | null;
  /** URL do avatar do usuário */
  avatar_url: string | null;
  /** Email do usuário */
  email: string | null;
};

/**
 * Tipo que define a estrutura do contexto de autenticação
 */
type AuthContextType = {
  /** Usuário autenticado atual ou null se não autenticado */
  user: User | null;
  /** Perfil do usuário atual ou null se não encontrado */
  profile: Profile | null;
  /** Sessão atual do usuário ou null se não autenticado */
  session: Session | null;
  /** Indica se alguma operação de autenticação está em andamento */
  loading: boolean;
  /** Último erro ocorrido em operações de autenticação */
  error: Error | null;
  /** Função para realizar login com email e senha */
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  /** Função para criar uma nova conta */
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{ error: AuthError | null }>;
  /** Função para fazer logout */
  signOut: () => Promise<void>;
  /** Função para atualizar o perfil do usuário */
  refreshProfile: () => Promise<void>;
};

// Criar contexto com tipo definido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Provedor de contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Limpa todos os estados do contexto
   * Usado durante o logout e quando o componente é desmontado
   */
  const cleanupState = () => {
    console.log('Limpando estado do AuthProvider...');
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
    setError(null);
    // Remover token do localStorage
    localStorage.removeItem('supabase.auth.token');
  };

  /**
   * Busca o perfil do usuário no banco de dados
   * @param userId - ID do usuário no Supabase
   * @returns Perfil do usuário ou null se não encontrado
   */
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Buscando perfil para userId:', userId);
      
      if (!userId) {
        console.error('Erro: userId é nulo ou vazio');
        throw new Error('ID de usuário inválido');
      }

      // Primeiro, tentar criar o perfil
      console.log('Tentando criar perfil...');
      const { error: createError } = await supabase
        .from('profiles')
        .upsert([{ id: userId }], { onConflict: 'id' });
        
      if (createError) {
        console.error('Erro ao criar/atualizar perfil:', createError);
        throw createError;
      }
      
      // Agora buscar o perfil
      console.log('Buscando perfil após criação/atualização...');
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar perfil:', fetchError);
        throw fetchError;
      }
      
      if (!profile) {
        throw new Error('Perfil não encontrado após criação');
      }
      
      // Adicionar email do usuário ao perfil
      const profileWithEmail = {
        ...profile,
        email: user?.email || null
      };
      
      console.log('Perfil encontrado:', profileWithEmail);
      return profileWithEmail as Profile;
    } catch (error) {
      console.error('Erro crítico ao buscar/criar perfil:', error);
      throw error;
    }
  };

  /**
   * Atualiza o perfil do usuário no contexto
   * Busca os dados mais recentes do perfil no banco de dados
   * @throws Error se ocorrer um erro durante a atualização do perfil
   */
  const refreshProfile = async () => {
    try {
      // Verificar sessão atual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erro ao obter sessão:', sessionError);
        throw new Error('Não foi possível verificar a sessão do usuário');
      }
      
      const session = sessionData.session;
      if (!session) {
        console.warn('Sessão não encontrada durante refresh do perfil');
        cleanupState();
        return;
      }

      // Validar ID do usuário
      if (!session.user?.id) {
        console.error('ID do usuário inválido na sessão');
        throw new Error('ID do usuário inválido');
      }

      // Se já temos o perfil atualizado para este usuário, não precisamos buscar novamente
      if (profile?.id === session.user.id) {
        console.log('Perfil já está atualizado para o usuário atual');
        return;
      }

      setLoading(true);
      setError(null);
      
      // Atualizar sessão e usuário primeiro
      setSession(session);
      setUser(session.user);
      
      try {
        // Buscar/criar perfil
        console.log('Buscando/criando perfil para:', session.user.id);
        const profileData = await fetchProfile(session.user.id);
        
        if (profileData) {
          console.log('Perfil atualizado com sucesso:', profileData);
          setProfile(profileData);
        } else {
          console.warn('Não foi possível encontrar/criar perfil');
          setProfile(null);
        }
      } catch (profileError) {
        console.error('Erro ao buscar/criar perfil:', profileError);
        setProfile(null);
        throw profileError;
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const customError = error instanceof Error
        ? error
        : new Error('Erro inesperado ao atualizar perfil');
      
      setError(customError);
      throw customError;
    } finally {
      setLoading(false);
    }
  };



  // Efeito para inicialização e limpeza
  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    let mounted = true;

    /**
     * Limpa todos os estados do contexto
     * Usado durante o logout e quando o componente é desmontado
     */
    const cleanupState = () => {
      console.log('Limpando estado do AuthProvider...');
      if (mounted) {
        setUser(null);
        setProfile(null);
        setSession(null);
        setLoading(false);
        setError(null);
        // Remover token do localStorage
        localStorage.removeItem('supabase.auth.token');
      }
    };

    /**
     * Atualiza o perfil do usuário no contexto
     * @param userId - ID do usuário no Supabase
     */
    const updateProfile = async (userId: string) => {
      if (!mounted) return;
      try {
        const data = await fetchProfile(userId);
        if (mounted && data) {
          setProfile(data);
        } else if (mounted) {
          setProfile(null);
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        if (mounted) {
          setProfile(null);
        }
      }
    };

    /**
     * Atualiza o estado do usuário no contexto
     * @param newSession - Nova sessão do usuário
     */
    const updateUserState = async (newSession: Session | null) => {
      if (!mounted) {
        console.log('Componente desmontado, ignorando atualização');
        return;
      }
      
      try {
        const newUser = newSession?.user ?? null;
        console.log('Atualizando estado do usuário:', {
          userId: newUser?.id,
          email: newUser?.email,
          sessionExpires: newSession?.expires_at
        });
        
        // Atualizar sessão e usuário de forma síncrona
        setSession(newSession);
        setUser(newUser);

        if (newUser) {
          // Verificar se o usuário mudou antes de buscar o perfil
          if (user?.id !== newUser.id || !profile) {
            console.log('Buscando perfil para novo usuário ou perfil ausente');
            try {
              const profileData = await fetchProfile(newUser.id);
              if (mounted && profileData) {
                console.log('Perfil atualizado com sucesso:', profileData);
                setProfile(profileData);
              } else if (mounted) {
                console.error('Perfil não encontrado após busca');
                setProfile(null);
                // Definir loading como false para evitar carregamento infinito
                setLoading(false);
              }
            } catch (profileError) {
              console.error('Erro ao buscar perfil:', profileError);
              if (mounted) {
                // Não limpar a sessão em caso de erro no perfil
                setProfile(null);
                // Definir loading como false para evitar carregamento infinito
                setLoading(false);
              }
            }
          } else {
            console.log('Usuário não mudou, mantendo perfil atual');
          }
        } else {
          console.log('Sessão inválida, limpando estados');
          if (mounted) {
            setProfile(null);
            // Definir loading como false para evitar carregamento infinito
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Erro crítico ao atualizar estado:', error);
        // Em caso de erro crítico, limpar todos os estados
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          // Limpar localStorage em caso de erro crítico
          localStorage.removeItem('supabase.auth.token');
          // Definir loading como false para evitar carregamento infinito
          setLoading(false);
        }
      }
    };

    /**
     * Inicializa a sessão do usuário
     * Verifica se existe uma sessão válida e carrega o perfil
     */
    const initSession = async () => {
      try {
        console.log('Iniciando inicialização da sessão...');
        setLoading(true);
        
        // Verificar sessão diretamente no Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          throw new Error('Não foi possível inicializar a sessão');
        }
        
        if (data.session) {
          const { session } = data;
          console.log('Sessão válida encontrada:', {
            userId: session.user?.id,
            expiresAt: new Date(session.expires_at! * 1000).toISOString()
          });
          
          // Atualizar localStorage
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            currentSession: session,
            expiresAt: session.expires_at
          }));
          
          // Atualizar estado do usuário
          setSession(session);
          setUser(session.user);
          
          // Buscar perfil existente
          try {
            console.log('Iniciando busca de perfil...');
            if (!session.user.id) {
              throw new Error('ID de usuário inválido na sessão');
            }
            
            const profileData = await fetchProfile(session.user.id);
            if (profileData && profileData.id) {
              console.log('Perfil carregado com sucesso:', profileData);
              setProfile(profileData);
            } else {
              console.log('Perfil não encontrado para o usuário:', session.user.id);
              // Se não encontrou perfil, tenta criar um novo
              const newProfileData = await fetchProfile(session.user.id);
              if (newProfileData && newProfileData.id) {
                console.log('Novo perfil criado com sucesso:', newProfileData);
                setProfile(newProfileData);
              } else {
                console.error('Falha ao criar novo perfil');
                setProfile(null);
              }
            }
          } catch (profileError) {
            console.error('Erro ao carregar/criar perfil:', profileError);
            setProfile(null);
          }
        } else {
          console.log('Nenhuma sessão ativa encontrada');
          cleanupState();
        }
      } catch (error) {
        console.error('Erro ao inicializar sessão:', error);
        cleanupState();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Iniciar sessão
    initSession();

    // Configurar listener de autenticação com retry
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupAuthListener = () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Evento de autenticação:', event, {
              userId: session?.user?.id,
              email: session?.user?.email
            });
            
            switch (event) {
              case 'SIGNED_IN':
                console.log('Usuário autenticado com sucesso');
                await updateUserState(session);
                break;
                
              case 'SIGNED_OUT':
                console.log('Usuário desconectado');
                cleanupState();
                break;
                
              case 'TOKEN_REFRESHED':
                console.log('Token de autenticação atualizado');
                await updateUserState(session);
                break;
                
              case 'USER_UPDATED':
                console.log('Dados do usuário atualizados');
                await updateUserState(session);
                break;
                
              default:
                console.log('Evento não tratado:', event);
                await updateUserState(session);
                break;
            }
          }
        );

        return subscription;
      } catch (error) {
        console.error('Erro ao configurar listener de autenticação:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Tentando reconectar... Tentativa ${retryCount} de ${maxRetries}`);
          setTimeout(setupAuthListener, 1000 * retryCount);
        } else {
          console.error('Não foi possível estabelecer conexão após', maxRetries, 'tentativas');
        }
        return null;
      }
    };

    const subscription = setupAuthListener();

    return () => {
      console.log('Desmontando AuthProvider...');
      mounted = false;
      if (subscription) {
        console.log('Removendo listener de autenticação');
        subscription.unsubscribe();
      }
      cleanupState();
    };
  }, []); 

  /**
   * Realiza o login do usuário com email e senha
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Objeto contendo erro (se houver)
   * @throws Error se ocorrer um erro durante o processo de login
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validar entrada
      if (!email?.trim()) {
        const error = new Error('O email é obrigatório');
        setError(error);
        return { error };
      }

      if (!password?.trim()) {
        const error = new Error('A senha é obrigatória');
        setError(error);
        return { error };
      }

      console.log('Iniciando processo de login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Erro ao fazer login:', error);
        
        // Traduzir mensagens de erro comuns
        let translatedError;
        switch (error.message) {
          case 'Invalid login credentials':
            translatedError = new Error('E-mail ou senha incorretos');
            break;
          case 'Email not confirmed':
            translatedError = new Error('E-mail não confirmado. Por favor, verifique sua caixa de entrada.');
            break;
          case 'Too many requests':
            translatedError = new Error('Muitas tentativas de login. Por favor, aguarde alguns minutos.');
            break;
          case 'Invalid email':
            translatedError = new Error('O email informado é inválido');
            break;
          case 'Password is too short':
            translatedError = new Error('A senha deve ter pelo menos 6 caracteres');
            break;
          default:
            translatedError = new Error(
              error.message === 'Failed to fetch'
                ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
                : 'Erro ao fazer login. Por favor, tente novamente.'
            );
        }
        
        setError(translatedError);
        return { error: translatedError };
      }

      if (!data.session) {
        const error = new Error('Sessão inválida após login');
        setError(error);
        return { error };
      }

      // Salvar sessão localmente
      console.log('Login realizado com sucesso');
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: data.session,
        expiresAt: data.session.expires_at
      }));

      return { error: null };
    } catch (error) {
      console.error('Erro inesperado ao fazer login:', error);
      const unexpectedError = new Error(
        error instanceof Error
          ? `Erro ao fazer login: ${error.message}`
          : 'Ocorreu um erro inesperado. Por favor, tente novamente.'
      );
      setError(unexpectedError);
      return { error: unexpectedError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cria uma nova conta de usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @param metadata - Dados adicionais do usuário (opcional)
   * @returns Objeto contendo erro (se houver)
   * @throws Error se ocorrer um erro durante o processo de cadastro
   */
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setLoading(true);
      setError(null);

      // Validar entrada
      if (!email?.trim()) {
        const error = new Error('O email é obrigatório');
        setError(error);
        return { error };
      }

      if (!password?.trim()) {
        const error = new Error('A senha é obrigatória');
        setError(error);
        return { error };
      }

      console.log('Iniciando processo de cadastro...');
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error('Erro ao criar conta:', error);
        
        // Traduzir mensagens de erro comuns
        let translatedError;
        switch (error.message) {
          case 'User already registered':
            translatedError = new Error('Este email já está cadastrado');
            break;
          case 'Password is too short':
            translatedError = new Error('A senha deve ter pelo menos 6 caracteres');
            break;
          case 'Invalid email':
            translatedError = new Error('O email informado é inválido');
            break;
          default:
            translatedError = new Error(
              error.message === 'Failed to fetch'
                ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
                : 'Erro ao criar conta. Por favor, tente novamente.'
            );
        }
        
        setError(translatedError);
        return { error: translatedError };
      }

      if (!data.user) {
        const error = new Error('Erro ao criar conta. Por favor, tente novamente.');
        setError(error);
        return { error };
      }

      console.log('Conta criada com sucesso');
      
      // Criar perfil automaticamente após cadastro bem-sucedido
      try {
        if (data.user) {
          await fetchProfile(data.user.id);
          console.log('Perfil criado automaticamente após cadastro');
        }
      } catch (profileError) {
        console.error('Erro ao criar perfil após cadastro:', profileError);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Erro inesperado ao criar conta:', error);
      const unexpectedError = new Error(
        error instanceof Error
          ? `Erro ao criar conta: ${error.message}`
          : 'Ocorreu um erro inesperado. Por favor, tente novamente.'
      );
      setError(unexpectedError);
      return { error: unexpectedError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o logout do usuário
   * Limpa todos os dados da sessão e do perfil
   */
  /**
   * Realiza o logout do usuário
   * Limpa todos os dados da sessão e do perfil
   */
  const signOut = async () => {
    try {
      console.log('Iniciando processo de logout...');
      setLoading(true);
      setError(null);

      // Fazer logout no Supabase primeiro
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
        const customError = new Error('Não foi possível fazer logout. Por favor, tente novamente.');
        setError(customError);
        throw customError;
      }

      // Limpar estados e dados locais
      cleanupState();
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      const customError = error instanceof Error ? error : new Error('Erro inesperado ao fazer logout');
      setError(customError);
      throw customError;
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

