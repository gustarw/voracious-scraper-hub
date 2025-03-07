
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Clock, Sparkles, ArrowRight, BarChart3, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [recentScrapes, setRecentScrapes] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setRecentScrapes(Math.floor(Math.random() * 8) + 1);
      setStatsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
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
      
      <div className="space-y-8 animate-fade-in" style={{ '--index': 0 } as React.CSSProperties}>
        {/* Welcome section */}
        <section className="p-6 glass-panel">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Bem-vindo{profile?.username ? `, ${profile.username}` : ''}!
              </h2>
              <p className="text-secondary mb-2">
                Esta é sua central de monitoramento de dados. Comece extraindo dados com facilidade.
              </p>
            </div>
            <Link to="/dashboard/scraping">
              <Button 
                className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black"
              >
                Nova Extração
                <Globe className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Stats overview */}
        <section>
          <h3 className="text-xl font-medium mb-4 text-white/90">Visão Geral</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dashboard-stats-card animate-slide-up" style={{ '--index': 1 } as React.CSSProperties}>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium text-white/70 flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-scrapvorn-orange" />
                  Extrações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-10 w-16 bg-white/10 rounded animate-pulse"></div>
                ) : (
                  <div className="flex flex-col">
                    <span className="dashboard-stats-value">{recentScrapes}</span>
                    <span className="dashboard-stats-label">nos últimos 7 dias</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="dashboard-stats-card animate-slide-up" style={{ '--index': 2 } as React.CSSProperties}>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium text-white/70 flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-scrapvorn-orange" />
                  Próximo Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-10 w-36 bg-white/10 rounded animate-pulse"></div>
                ) : (
                  <div className="flex flex-col">
                    <span className="dashboard-stats-value">
                      {recentScrapes > 0 ? "Hoje, 18:00" : "Nenhum"}
                    </span>
                    <span className="dashboard-stats-label">
                      {recentScrapes > 0 ? "e-commerce monitor" : "agendamento configurado"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="dashboard-stats-card animate-slide-up" style={{ '--index': 3 } as React.CSSProperties}>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium text-white/70 flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-scrapvorn-orange" />
                  Seu Plano
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-10 w-24 bg-white/10 rounded animate-pulse"></div>
                ) : (
                  <div className="flex flex-col">
                    <span className="dashboard-stats-value">Básico</span>
                    <span className="dashboard-stats-label">5 scrapes por dia</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Quick access section */}
        <section>
          <h3 className="text-xl font-medium mb-4 text-white/90">Acesso Rápido</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/dashboard/scraping" className="dashboard-card p-6 flex flex-col items-center text-center group">
              <Globe className="h-10 w-10 text-scrapvorn-orange mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-white mb-1">Extração de Dados</h4>
              <p className="text-sm text-secondary-foreground">Colete dados de qualquer site facilmente</p>
            </Link>
            
            <Link to="/dashboard/filtros" className="dashboard-card p-6 flex flex-col items-center text-center group">
              <BarChart3 className="h-10 w-10 text-scrapvorn-orange mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-white mb-1">Filtros Avançados</h4>
              <p className="text-sm text-secondary-foreground">Configure filtros para dados específicos</p>
            </Link>
            
            <Link to="/dashboard/agendamento" className="dashboard-card p-6 flex flex-col items-center text-center group">
              <Clock className="h-10 w-10 text-scrapvorn-orange mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-white mb-1">Agendamento</h4>
              <p className="text-sm text-secondary-foreground">Automatize suas extrações com agendamentos</p>
            </Link>
            
            <Link to="/dashboard/exportacao" className="dashboard-card p-6 flex flex-col items-center text-center group">
              <ArrowRight className="h-10 w-10 text-scrapvorn-orange mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-white mb-1">Exportação</h4>
              <p className="text-sm text-secondary-foreground">Exporte dados em vários formatos</p>
            </Link>
          </div>
        </section>
        
        {/* Recent activity placeholder */}
        <section>
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-scrapvorn-gray/20 rounded-xl text-center">
            <AlertTriangle className="h-12 w-12 text-scrapvorn-orange/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Sem atividades recentes</h3>
            <p className="text-secondary-foreground max-w-md mb-4">
              Inicie sua primeira extração de dados para começar a ver suas atividades aqui.
            </p>
            <Link to="/dashboard/scraping">
              <Button 
                className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black"
              >
                Começar a Extrair Dados
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
