
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const ProfileLoadingSpinner = () => (
  <DashboardLayout>
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin"></div>
    </div>
  </DashboardLayout>
);
