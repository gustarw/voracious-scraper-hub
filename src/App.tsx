
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// Dashboard pages
import Scraping from "@/pages/dashboard/Scraping";
import Projetos from "@/pages/dashboard/Projetos";
import Filtros from "@/pages/dashboard/Filtros";
import Exportacao from "@/pages/dashboard/Exportacao";
import Agendamento from "@/pages/dashboard/Agendamento";
import IntegracaoAPIs from "@/pages/dashboard/IntegracaoAPIs";
import Webhooks from "@/pages/dashboard/Webhooks";
import Configuracoes from "@/pages/dashboard/Configuracoes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
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
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
