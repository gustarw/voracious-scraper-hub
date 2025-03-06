
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, refreshProfile } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();
  
  // Verificar sessão ao carregar o componente ou mudar de rota
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
        // Garantir que o estado de verificação termine
        if (isCheckingAuth) {
          setIsCheckingAuth(false);
        }
      }
    };
    
    checkSession();
  }, [location.pathname]);
  
  useEffect(() => {
    // Once the auth check is completed (loading is false), update our local state
    if (!loading) {
      setIsCheckingAuth(false);
    }
    
    // Add a safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 3000); // 3 seconds timeout (reduzido de 5s para 3s)
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Show loading state only if we're still checking auth status
  if ((loading || isCheckingAuth) && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
