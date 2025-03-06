
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FirecrawlService } from "@/services/FirecrawlService";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskList } from "@/components/dashboard/TaskList";
import { NewTaskForm } from "@/components/dashboard/NewTaskForm";
import { ApiKeySetup } from "@/components/dashboard/ApiKeySetup";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  // 1. Hooks de contexto
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // 2. Estados locais
  const [hasApiKey, setHasApiKey] = useState(() => {
    const apiKey = FirecrawlService.getApiKey();
    return !!apiKey;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // 3. Efeitos - sempre na mesma ordem
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      if (!mounted) return;

      try {
        console.log('Dashboard: Verificando sessão...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (!session) {
          console.log('Dashboard: Nenhuma sessão encontrada');
          setIsLoading(false);
          return;
        }

        // Se temos sessão mas não temos usuário, atualiza o perfil
        if (session && !user) {
          console.log('Dashboard: Sessão encontrada, atualizando perfil...');
          await refreshProfile();
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Dashboard: Erro ao verificar sessão:', error);
      } finally {
        if (mounted) {
          setSessionChecked(true);
          setIsLoading(false);
        }
      }
    };
    
    checkSession();

    return () => {
      mounted = false;
    };
  }, []); // Executar apenas na montagem do componente

  // Atualizar perfil apenas quando não tivermos um perfil
  useEffect(() => {
    if (!user || profile) return;
    
    const loadUserProfile = async () => {      
      try {
        console.log("Dashboard: Perfil ausente, buscando do banco...");
        await refreshProfile();
      } catch (error) {
        console.error("Dashboard: Erro ao buscar perfil:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seu perfil. Por favor, tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    };
    
    loadUserProfile();
  }, [user, profile, refreshProfile, toast]);

  // Mostrar mensagem de erro quando não encontrar perfil
  useEffect(() => {
    if (!isLoading && user && !profile) {
      console.log("Dashboard: Perfil não encontrado no banco de dados.");
      toast({
        title: "Perfil não encontrado",
        description: "Não foi possível encontrar seu perfil. Por favor, contate o suporte.",
        variant: "destructive"
      });
    }
  }, [isLoading, user, profile, toast]);

  // 4. Handlers
  const handleApiKeySaved = () => {
    setHasApiKey(true);
  };

  // 5. Renderização condicional de loading
  if (isLoading || authLoading || !sessionChecked) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-10 h-10 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-scrapvorn-gray">
            Carregando informações...
          </p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <DashboardHeader />
      
      {!hasApiKey ? (
        <ApiKeySetup onApiKeySaved={handleApiKeySaved} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <NewTaskForm />
            </div>
            <div className="lg:col-span-2">
              <TaskList />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
