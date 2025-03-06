interface ScrapingTask {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  settings: {
    limit?: number;
    depth?: number;
    formats?: string[];
  };
}

interface ScrapingResult {
  taskId: string;
  data: any;
  creditsUsed: number;
  completedPages: number;
  totalPages: number;
  timestamp: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static TASKS_STORAGE_KEY = 'firecrawl_tasks';
  private static RESULTS_STORAGE_KEY = 'firecrawl_results';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Create a new scraping task
      const task = await this.createScrapingTask(url);
      
      // Execute the task immediately
      return await this.executeScrapingTask(task.id);
    } catch (error) {
      console.error('Error in crawlWebsite:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to crawl website' 
      };
    }
  }

  static async createScrapingTask(url: string, settings = {}): Promise<ScrapingTask> {
    const task: ScrapingTask = {
      id: crypto.randomUUID(),
      url,
      status: 'pending',
      createdAt: new Date().toISOString(),
      settings: {
        limit: 100,
        depth: 1,
        formats: ['markdown'],
        ...settings
      }
    };

    // Store the task in local storage
    const existingTasks = this.getScrapingTasks();
    const updatedTasks = [...existingTasks, task];
    localStorage.setItem(this.TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));

    return task;
  }

  static getScrapingTasks(): ScrapingTask[] {
    const tasksJson = localStorage.getItem(this.TASKS_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  static getScrapingTask(id: string): ScrapingTask | undefined {
    const tasks = this.getScrapingTasks();
    return tasks.find(task => task.id === id);
  }

  static updateScrapingTask(id: string, updates: Partial<ScrapingTask>): ScrapingTask | null {
    const tasks = this.getScrapingTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return null;
    
    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;
    
    localStorage.setItem(this.TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return updatedTask;
  }

  static deleteScrapingTask(id: string): boolean {
    const tasks = this.getScrapingTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    localStorage.setItem(this.TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
    return true;
  }

  static saveScrapingResult(result: ScrapingResult): void {
    const existingResults = this.getScrapingResults();
    const updatedResults = [...existingResults, result];
    localStorage.setItem(this.RESULTS_STORAGE_KEY, JSON.stringify(updatedResults));
    
    // Update the related task status
    this.updateScrapingTask(result.taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  }

  static getScrapingResults(): ScrapingResult[] {
    const resultsJson = localStorage.getItem(this.RESULTS_STORAGE_KEY);
    return resultsJson ? JSON.parse(resultsJson) : [];
  }

  static getScrapingResultByTaskId(taskId: string): ScrapingResult | undefined {
    const results = this.getScrapingResults();
    return results.find(result => result.taskId === taskId);
  }

  static async executeScrapingTask(taskId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const task = this.getScrapingTask(taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const apiKey = this.getApiKey();
    if (!apiKey) return { success: false, error: 'API key not found' };

    try {
      console.log(`Executing scraping task for URL: ${task.url}`);
      
      // Simulated API call since we don't have the actual Firecrawl package
      // In a real implementation, you would use the Firecrawl SDK here
      const mockResponse = await this.mockFirecrawlApi(task);
      
      if (mockResponse.success) {
        // Save the result
        this.saveScrapingResult({
          taskId: task.id,
          data: mockResponse.data,
          creditsUsed: mockResponse.creditsUsed || 1,
          completedPages: mockResponse.completedPages || 5,
          totalPages: mockResponse.totalPages || 5,
          timestamp: new Date().toISOString()
        });
        
        return { success: true, data: mockResponse };
      } else {
        this.updateScrapingTask(taskId, { status: 'failed' });
        return { success: false, error: mockResponse.error || 'Failed to execute scraping task' };
      }
    } catch (error) {
      console.error('Error executing scraping task:', error);
      this.updateScrapingTask(taskId, { status: 'failed' });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to execute scraping task' 
      };
    }
  }

  // This is a mock function to simulate the Firecrawl API
  private static async mockFirecrawlApi(task: ScrapingTask): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 10% chance of failure to simulate real-world scenarios
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Failed to connect to website'
      };
    }
    
    return {
      success: true,
      status: 'completed',
      completedPages: 5,
      totalPages: 5,
      creditsUsed: 1,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      data: [
        {
          url: task.url,
          title: `Page title for ${new URL(task.url).hostname}`,
          content: `This is mock content extracted from ${task.url}. In a real implementation, this would contain the actual scraped content from the website.`,
          metadata: {
            description: 'Sample meta description',
            keywords: 'sample, keywords, scraping',
            author: 'Scrapvorn Demo'
          },
          links: [
            `${task.url}/page1`,
            `${task.url}/page2`,
            `${task.url}/about`
          ]
        }
      ]
    };
  }
}
