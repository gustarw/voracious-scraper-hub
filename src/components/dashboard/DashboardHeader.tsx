
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, LogOut, User } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface SearchState {
  query: string;
  isSearching: boolean;
}

export function DashboardHeader() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [search, setSearch] = useState<SearchState>({
    query: '',
    isSearching: false
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(prev => ({ ...prev, query }));
    
    // Aqui você pode implementar a lógica de pesquisa
    // Por exemplo, usando um debounce para evitar muitas requisições
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsOpen(false);
      
      await signOut();
      
      toast({
        title: "Até logo!",
        description: "Você foi desconectado com sucesso.",
        variant: "default"
      });
      
      // Redirecionar para a página de login
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      
      // Mostrar mensagem de erro mais amigável
      toast({
        title: "Ops! Algo deu errado",
        description: error instanceof Error 
          ? error.message 
          : "Não foi possível fazer logout. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/dashboard/perfil');
  };
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-scrapvorn-gray/10">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${search.isSearching ? 'text-scrapvorn-orange' : 'text-scrapvorn-gray'}`} 
          />
          <Input
            type="search"
            value={search.query}
            onChange={handleSearch}
            placeholder="Pesquisar..."
            disabled={isLoggingOut}
            className="pl-10 bg-black border-scrapvorn-gray/20 focus:border-scrapvorn-orange/50 w-full transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-scrapvorn-gray hover:text-scrapvorn-orange transition-colors"
          aria-label="Notificações"
          disabled={isLoggingOut}
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full ring-offset-black transition-all focus-visible:ring-2 focus-visible:ring-scrapvorn-orange focus-visible:ring-offset-2"
              disabled={isLoggingOut}
              aria-label="Menu do usuário"
              aria-expanded={isOpen}
              aria-haspopup="menu"
            >
              <UserAvatar />
              {isLoggingOut && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-scrapvorn-orange/30 border-t-scrapvorn-orange rounded-full animate-spin" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-black border border-scrapvorn-gray/10 animate-in fade-in-0 zoom-in-95"
          >
            <div className="px-2 py-2 border-b border-scrapvorn-gray/10">
              <p className="text-sm font-medium truncate">
                {profile?.username || "Visitante"}
              </p>
              <p className="text-xs text-scrapvorn-gray truncate">
                {profile?.email || "Sem email cadastrado"}
              </p>
            </div>
            
            <div className="p-1">
              <DropdownMenuItem 
                onClick={handleProfileClick} 
                className="cursor-pointer focus:bg-white/5 focus:text-white group"
                disabled={isLoggingOut}
              >
                <User className="mr-2 h-4 w-4 group-hover:text-scrapvorn-orange transition-colors" />
                <span>Perfil</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-scrapvorn-gray/10" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 group"
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4 group-hover:text-red-400 transition-colors" />
                <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
