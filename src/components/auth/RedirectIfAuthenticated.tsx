
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
}

export const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      setIsRedirecting(true);
      navigate('/dashboard');
    }
  }, [user, loading, navigate, isRedirecting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? null : <>{children}</>;
};
