
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Once the auth check is completed (loading is false), update our local state
    if (!loading) {
      setIsCheckingAuth(false);
    }
    
    // Add a safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Show loading state only if we're still checking auth status
  if (loading && isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
