
import { useState, useEffect } from "react";
import { FirecrawlService } from "@/services/FirecrawlService";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskList } from "@/components/dashboard/TaskList";
import { NewTaskForm } from "@/components/dashboard/NewTaskForm";
import { ApiKeySetup } from "@/components/dashboard/ApiKeySetup";

const Dashboard = () => {
  const [hasApiKey, setHasApiKey] = useState(() => {
    const apiKey = FirecrawlService.getApiKey();
    return !!apiKey;
  });

  const handleApiKeySaved = () => {
    setHasApiKey(true);
  };

  return (
    <DashboardLayout>
      <DashboardHeader />
      
      {!hasApiKey ? (
        <ApiKeySetup onApiKeySaved={handleApiKeySaved} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <NewTaskForm />
            </div>
            <div className="lg:col-span-2">
              <TaskList />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
