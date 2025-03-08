
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProfileNotFound = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-white/70">Sessão expirada ou inválida.</p>
        <Button
          onClick={() => navigate('/login')}
          className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90"
        >
          Fazer Login
        </Button>
      </div>
    </DashboardLayout>
  );
};
