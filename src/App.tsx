
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Scraping from "./pages/dashboard/Scraping";
import Filtros from "./pages/dashboard/Filtros";
import Agendamento from "./pages/dashboard/Agendamento";
import Exportacao from "./pages/dashboard/Exportacao";
import Projetos from "./pages/dashboard/Projetos";
import Webhooks from "./pages/dashboard/Webhooks";
import IntegracaoAPIs from "./pages/dashboard/IntegracaoAPIs";
import Configuracoes from "./pages/dashboard/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/scraping" element={<Scraping />} />
          <Route path="/dashboard/filtros" element={<Filtros />} />
          <Route path="/dashboard/agendamento" element={<Agendamento />} />
          <Route path="/dashboard/exportacao" element={<Exportacao />} />
          <Route path="/dashboard/projetos" element={<Projetos />} />
          <Route path="/dashboard/webhooks" element={<Webhooks />} />
          <Route path="/dashboard/apis" element={<IntegracaoAPIs />} />
          <Route path="/dashboard/configuracoes" element={<Configuracoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
