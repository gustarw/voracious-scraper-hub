
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the user ID from the JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client and get the user ID from the JWT
    const token = authHeader.replace('Bearer ', '');
    const { user, error: userError } = await getUser(token);
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid user token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get the task ID from the request body
    const { taskId } = await req.json();
    if (!taskId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Task ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`[${user.id}] Checking status for task ${taskId}`);

    // Get the task from the database
    const { data: task, error: taskError } = await getTask(taskId, user.id);
    
    if (taskError || !task) {
      console.error(`Error getting task ${taskId} for user ${user.id}:`, taskError);
      return new Response(
        JSON.stringify({ success: false, error: 'Task not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get the scraped data for the task
    const { data: scrapedData, error: scrapedDataError } = await getScrapedData(taskId);
    
    if (scrapedDataError) {
      console.error(`Error getting scraped data for task ${taskId}:`, scrapedDataError);
    }

    // Return the task status and data
    return new Response(
      JSON.stringify({
        success: true,
        task,
        data: scrapedData || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
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
      return { user: null, error: new Error(`Failed to get user: ${response.statusText}`) };
    }
    
    const user = await response.json();
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

async function getTask(taskId: string, userId: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scraping_tasks?id=eq.${taskId}&user_id=eq.${userId}`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    if (!response.ok) {
      return { data: null, error: new Error(`Failed to get task: ${response.statusText}`) };
    }
    
    const data = await response.json();
    return { data: data[0] || null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function getScrapedData(taskId: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scraped_data?task_id=eq.${taskId}`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    if (!response.ok) {
      return { data: null, error: new Error(`Failed to get scraped data: ${response.statusText}`) };
    }
    
    const data = await response.json();
    return { data: data.map((item: any) => item.data), error: null };
  } catch (error) {
    return { data: null, error };
  }
}
