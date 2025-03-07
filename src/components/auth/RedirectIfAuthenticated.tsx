
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

export function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const { user, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (initialized && !loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, initialized, navigate, from]);

  if (loading || (initialized && user)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
