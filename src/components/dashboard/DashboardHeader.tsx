
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/context/AuthContext";

export function DashboardHeader() {
  const { profile } = useAuth();
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-scrapvorn-gray/10">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-scrapvorn-gray h-4 w-4" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            className="pl-10 bg-black border-scrapvorn-gray/20 focus:border-scrapvorn-orange/50 w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-scrapvorn-gray">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{profile?.username || "Usuário"}</p>
            <p className="text-xs text-scrapvorn-gray">Conta Pro</p>
          </div>
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}
