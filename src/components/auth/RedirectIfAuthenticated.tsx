import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}