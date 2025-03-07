
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Functionalities from "@/pages/Functionalities";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";

// Dashboard pages
import Scraping from "@/pages/dashboard/Scraping";
import Projetos from "@/pages/dashboard/Projetos";
import Filtros from "@/pages/dashboard/Filtros";
import Exportacao from "@/pages/dashboard/Exportacao";
import Agendamento from "@/pages/dashboard/Agendamento";
import IntegracaoAPIs from "@/pages/dashboard/IntegracaoAPIs";
import Webhooks from "@/pages/dashboard/Webhooks";
import Configuracoes from "@/pages/dashboard/Configuracoes";
import Perfil from "@/pages/dashboard/Perfil";
import Assinatura from "@/pages/dashboard/Assinatura";
import AssinaturaSucesso from "@/pages/dashboard/AssinaturaSucesso";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/funcionalidades" element={<Functionalities />} />
          <Route path="/como-funciona" element={<HowItWorks />} />
          <Route path="/precos" element={<Pricing />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/scraping" 
            element={
              <ProtectedRoute>
                <Scraping />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/projetos" 
            element={
              <ProtectedRoute>
                <Projetos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/filtros" 
            element={
              <ProtectedRoute>
                <Filtros />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/exportacao" 
            element={
              <ProtectedRoute>
                <Exportacao />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/agendamento" 
            element={
              <ProtectedRoute>
                <Agendamento />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/integracao-apis" 
            element={
              <ProtectedRoute>
                <IntegracaoAPIs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/webhooks" 
            element={
              <ProtectedRoute>
                <Webhooks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/configuracoes" 
            element={
              <ProtectedRoute>
                <Configuracoes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/perfil" 
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/assinatura" 
            element={
              <ProtectedRoute>
                <Assinatura />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/assinatura/sucesso" 
            element={
              <ProtectedRoute>
                <AssinaturaSucesso />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
