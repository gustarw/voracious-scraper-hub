
import { supabase } from "@/lib/supabase";

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  static async startCrawl(url: string): Promise<{ success: boolean; data?: any; error?: string; taskId?: string }> {
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('crawl-website', {
        body: { url }
      });
      
      if (error) {
        console.error('Error starting crawl:', error);
        return { success: false, error: error.message };
      }
      
      return { 
        success: true,
        taskId: data?.taskId,
        data: data 
      };
    } catch (error) {
      console.error('Error during crawl request:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  static async getCrawlStatus(taskId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('get-crawl-status', {
        body: { taskId }
      });
      
      if (error) {
        console.error('Error getting crawl status:', error);
        return { success: false, error: error.message };
      }
      
      return { 
        success: true,
        data: data 
      };
    } catch (error) {
      console.error('Error getting crawl status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get crawl status' 
      };
    }
  }
}
