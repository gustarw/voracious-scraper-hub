
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
}

export const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, refreshProfile } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Verificar se o usuário já está autenticado ao carregar o componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verificar se temos uma sessão válida no Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && !user) {
          console.log('Sessão encontrada, mas usuário não está no contexto. Atualizando perfil...');
          await refreshProfile();
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [location.pathname]);

  // Redirecionar para o dashboard se o usuário estiver autenticado
  useEffect(() => {
    if (!loading && !isCheckingSession && user && !isRedirecting) {
      console.log('Usuário autenticado, redirecionando para o dashboard...');
      setIsRedirecting(true);
      navigate('/dashboard');
    }
  }, [user, loading, navigate, isRedirecting, isCheckingSession]);

  // Mostrar loading apenas se estiver verificando autenticação
  if (loading || isCheckingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return user ? null : <>{children}</>;
};
