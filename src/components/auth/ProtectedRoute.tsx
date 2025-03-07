
import { useAuth } from "@/context/auth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent long waits
    const timer = setTimeout(() => {
      if (loading && !initialized) {
        setAuthTimeout(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, initialized]);

  if (authTimeout) {
    // If auth check is taking too long, navigate to auth page
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
