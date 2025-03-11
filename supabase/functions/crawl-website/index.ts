
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!FIRECRAWL_API_KEY) {
      throw new Error('Firecrawl API key not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify user with Supabase auth
    const { user, error: userError } = await getUser(token);
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid user token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { url } = await req.json();
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`[${user.id}] Making request to Firecrawl API for URL: ${url}`);
    
    // Create task record before sending request to Firecrawl
    const { data: taskData, error: taskCreateError } = await createScrapingTask(user.id, url);
    
    if (taskCreateError) {
      console.error('Error creating task record:', taskCreateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create scraping task' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const taskId = taskData.id;
    console.log(`Created task with ID ${taskId} for user ${user.id}`);

    // Make request to Firecrawl API
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url,
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
          waitForSelector: 'body',
          timeout: 60000 // Increased timeout to 60 seconds
        }
      })
    });

    const firecrawlData = await firecrawlResponse.json();
    console.log(`Firecrawl API response for task ${taskId}:`, JSON.stringify(firecrawlData).substring(0, 300) + '...');

    if (!firecrawlResponse.ok) {
      console.error(`Firecrawl API error for task ${taskId}:`, firecrawlData);
      
      // Update task status to error
      await updateTaskStatus(taskId, 'error', firecrawlData.completed || 0, firecrawlData.total || 0);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: firecrawlData.message || 'Firecrawl API error',
          taskId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: firecrawlResponse.status }
      );
    }

    // Update task with info from Firecrawl
    await updateTaskStatus(
      taskId, 
      firecrawlData.data && firecrawlData.data.length > 0 ? 'completed' : 'processing',
      firecrawlData.completed || 0,
      firecrawlData.total || 0,
      firecrawlData.creditsUsed || 0,
      firecrawlData.expiresAt
    );

    // Store scraped data if available
    if (firecrawlData.data && firecrawlData.data.length > 0) {
      for (const item of firecrawlData.data) {
        const { error: insertError } = await storeScrapedData(taskId, item);
          
        if (insertError) {
          console.error(`Error inserting scraped data for task ${taskId}:`, insertError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        taskId,
        status: firecrawlData.data && firecrawlData.data.length > 0 ? 'completed' : 'processing',
        url,
        completed: firecrawlData.completed || 0,
        total: firecrawlData.total || 0,
        creditsUsed: firecrawlData.creditsUsed || 0,
        expiresAt: firecrawlData.expiresAt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in crawl-website edge function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function getUser(token: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    if (!response.ok) {
      return { user: null, error: new Error('Failed to get user') };
    }
    
    const user = await response.json();
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

async function createScrapingTask(userId: string, url: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scraping_tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        user_id: userId,
        url,
        status: 'processing'
      })
    });
    
    if (!response.ok) {
      return { data: null, error: new Error(`Failed to create task: ${response.statusText}`) };
    }
    
    const data = await response.json();
    return { data: data[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function updateTaskStatus(
  taskId: string, 
  status: string, 
  completed: number = 0, 
  total: number = 0,
  creditsUsed: number = 0,
  expiresAt?: string
) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scraping_tasks?id=eq.${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        status,
        completed,
        total,
        credits_used: creditsUsed,
        expires_at: expiresAt
      })
    });
    
    if (!response.ok) {
      console.error(`Failed to update task ${taskId} status: ${response.statusText}`);
      return { error: new Error(`Failed to update task status: ${response.statusText}`) };
    }
    
    return { error: null };
  } catch (error) {
    console.error(`Error updating task ${taskId} status:`, error);
    return { error };
  }
}

async function storeScrapedData(taskId: string, data: any) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scraped_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        task_id: taskId,
        data
      })
    });
    
    if (!response.ok) {
      return { error: new Error(`Failed to store scraped data: ${response.statusText}`) };
    }
    
    return { error: null };
  } catch (error) {
    return { error };
  }
}
