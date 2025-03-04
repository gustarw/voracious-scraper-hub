
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FirecrawlService } from "@/services/FirecrawlService";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskList } from "@/components/dashboard/TaskList";
import { NewTaskForm } from "@/components/dashboard/NewTaskForm";
import { ApiKeySetup } from "@/components/dashboard/ApiKeySetup";

const Dashboard = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiKey = FirecrawlService.getApiKey();
    setHasApiKey(!!apiKey);
    setIsLoading(false);
  }, []);

  const handleApiKeySaved = () => {
    setHasApiKey(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
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
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
