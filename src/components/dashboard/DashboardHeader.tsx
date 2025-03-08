
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SearchState {
  query: string;
  isSearching: boolean;
}

export function DashboardHeader() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
        
        {/* Use the UserAvatar component directly without wrapping it in another Dropdown */}
        <UserAvatar className="h-8 w-8" />
      </div>
    </div>
  );
}
