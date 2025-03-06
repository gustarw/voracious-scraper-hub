
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CallToAction } from "@/components/home/CallToAction";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  
  // Redirect logged-in users to dashboard
  if (user && !loading) {
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
