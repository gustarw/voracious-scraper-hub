
import { useState } from "react";
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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Globe, label: "Scraping", href: "/dashboard/scraping" },
    { icon: Filter, label: "Filtros", href: "/dashboard/filtros" },
    { icon: Calendar, label: "Agendamento", href: "/dashboard/agendamento" },
    { icon: Download, label: "Exportação", href: "/dashboard/exportacao" },
    { icon: FolderKanban, label: "Projetos", href: "/dashboard/projetos" },
    { icon: Webhook, label: "Webhooks", href: "/dashboard/webhooks" },
    { icon: Code, label: "Integração APIs", href: "/dashboard/apis" },
    { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "bg-black border-r border-scrapvorn-gray/10 h-screen transition-all duration-300 flex flex-col",
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
          className={cn("text-scrapvorn-gray hover:text-white hover:bg-white/5", collapsed ? "ml-0" : "")}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <div className="flex-1 py-8 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
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
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-scrapvorn-gray/10">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-scrapvorn-gray hover:text-white hover:bg-white/5 flex items-center",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={signOut}
        >
          <LogOut size={20} className={collapsed ? "mx-auto" : "mr-3"} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}
