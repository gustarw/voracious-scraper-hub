import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Globe,
  Filter,
  Calendar,
  Download,
  FolderKanban,
  Webhook,
  Code,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/context/auth";

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mainMenuItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Globe, label: "Scraping", href: "/dashboard/scraping" },
    { icon: Filter, label: "Filtros", href: "/dashboard/filtros" },
    { icon: Calendar, label: "Agendamento", href: "/dashboard/agendamento" },
    { icon: Download, label: "Exportação", href: "/dashboard/exportacao" },
    { icon: FolderKanban, label: "Projetos", href: "/dashboard/projetos" },
  ];

  const integrationMenuItems: SidebarItem[] = [
    { icon: Webhook, label: "Webhooks", href: "/dashboard/webhooks" },
    { icon: Code, label: "Integração APIs", href: "/dashboard/integracao-apis" },
  ];

  const accountMenuItems: SidebarItem[] = [
    { icon: User, label: "Perfil", href: "/dashboard/perfil" },
    { icon: CreditCard, label: "Assinatura", href: "/dashboard/assinatura" },
    { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderMenuItems = (items: SidebarItem[]) => {
    return items.map((item) => {
      const isActive = location.pathname === item.href;
      const Icon = item.icon;
      
      return (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-3 rounded-md transition-colors",
            isActive
              ? "bg-scrapvorn-orange/10 text-scrapvorn-orange"
              : "text-scrapvorn-gray hover:bg-white/5 hover:text-white",
            collapsed ? "justify-center" : ""
          )}
        >
          <Icon size={20} className={collapsed ? "mx-auto" : "mr-3"} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      );
    });
  };

  return (
    <div
      className={cn(
        "bg-sidebar transition-all duration-300 flex flex-col h-screen border-r border-scrapvorn-gray/10",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-scrapvorn-gray/10">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          <Logo className={cn("w-auto", collapsed ? "h-8" : "h-10")} compact={collapsed} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("text-scrapvorn-gray hover:text-white hover:bg-white/5", collapsed ? "absolute -right-10 bg-sidebar border border-scrapvorn-gray/10 border-l-0 rounded-l-none" : "")}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-scrapvorn-gray/20 scrollbar-track-transparent">
        {!collapsed && (
          <div className="px-4 mb-2">
            <p className="text-xs uppercase tracking-wider text-scrapvorn-gray/50 font-medium">
              Principal
            </p>
          </div>
        )}
        <nav className="px-2 space-y-1 mb-6">
          {renderMenuItems(mainMenuItems)}
        </nav>
        
        {!collapsed && (
          <div className="px-4 mb-2">
            <p className="text-xs uppercase tracking-wider text-scrapvorn-gray/50 font-medium">
              Integrações
            </p>
          </div>
        )}
        <nav className="px-2 space-y-1 mb-6">
          {renderMenuItems(integrationMenuItems)}
        </nav>
        
        {!collapsed && (
          <div className="px-4 mb-2">
            <p className="text-xs uppercase tracking-wider text-scrapvorn-gray/50 font-medium">
              Conta
            </p>
          </div>
        )}
        <nav className="px-2 space-y-1">
          {renderMenuItems(accountMenuItems)}
        </nav>
      </div>
      
      {!collapsed && profile && (
        <div className="p-4 border-t border-scrapvorn-gray/10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-scrapvorn-orange/20 text-scrapvorn-orange flex items-center justify-center text-xs font-medium">
              {profile.username ? profile.username.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white truncate">
                {profile.username || "Usuário"}
              </p>
              <p className="text-xs text-scrapvorn-gray truncate">
                Plano Básico
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
