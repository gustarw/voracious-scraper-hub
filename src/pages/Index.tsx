
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CallToAction } from "@/components/home/CallToAction";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [checkComplete, setCheckComplete] = useState(false);
  
  useEffect(() => {
    if (!loading) {
      setCheckComplete(true);
    }
    
    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setCheckComplete(true);
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [loading]);
  
  // Show loading only briefly while checking auth
  if (loading && !checkComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Redirect logged-in users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="pricing">
          <CallToAction />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
