
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Scraping from "./pages/dashboard/Scraping";
import Filtros from "./pages/dashboard/Filtros";
import Agendamento from "./pages/dashboard/Agendamento";
import Exportacao from "./pages/dashboard/Exportacao";
import Projetos from "./pages/dashboard/Projetos";
import Webhooks from "./pages/dashboard/Webhooks";
import IntegracaoAPIs from "./pages/dashboard/IntegracaoAPIs";
import Configuracoes from "./pages/dashboard/Configuracoes";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/scraping" element={
              <ProtectedRoute>
                <Scraping />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/filtros" element={
              <ProtectedRoute>
                <Filtros />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/agendamento" element={
              <ProtectedRoute>
                <Agendamento />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/exportacao" element={
              <ProtectedRoute>
                <Exportacao />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/projetos" element={
              <ProtectedRoute>
                <Projetos />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/webhooks" element={
              <ProtectedRoute>
                <Webhooks />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/apis" element={
              <ProtectedRoute>
                <IntegracaoAPIs />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/configuracoes" element={
              <ProtectedRoute>
                <Configuracoes />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
