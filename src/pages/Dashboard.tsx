
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

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
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Dashboard</h2>
        <p className="text-scrapvorn-gray">
          Esta é a versão simplificada do dashboard. As funcionalidades serão reimplementadas em breve.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
