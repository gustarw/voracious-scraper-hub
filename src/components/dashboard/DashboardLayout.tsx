
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className={cn("container mx-auto px-4 py-6", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
