
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts';

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

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
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

    console.log('Making request to Firecrawl API for URL:', url);
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
          timeout: 30000
        }
      })
    });

    const firecrawlData = await firecrawlResponse.json();
    console.log('Firecrawl API response:', firecrawlData);

    if (!firecrawlResponse.ok) {
      console.error('Firecrawl API error:', firecrawlData);
      return new Response(
        JSON.stringify({ success: false, error: firecrawlData.message || 'Firecrawl API error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: firecrawlResponse.status }
      );
    }

    const { data: taskData, error: taskError } = await supabaseClient
      .from('scraping_tasks')
      .insert({
        user_id: user.id,
        url,
        status: 'processing',
        completed: firecrawlData.completed || 0,
        total: firecrawlData.total || 0,
        credits_used: firecrawlData.creditsUsed || 0,
        expires_at: firecrawlData.expiresAt
      })
      .select()
      .single();

    if (taskError) {
      console.error('Error creating task:', taskError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create task' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (firecrawlData.data && firecrawlData.data.length > 0) {
      for (const item of firecrawlData.data) {
        const { error: insertError } = await supabaseClient
          .from('scraped_data')
          .insert({
            task_id: taskData.id,
            data: item
          });
          
        if (insertError) {
          console.error('Error inserting scraped data:', insertError);
        }
      }
      
      // Update task status to completed
      await supabaseClient
        .from('scraping_tasks')
        .update({ status: 'completed' })
        .eq('id', taskData.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        taskId: taskData.id,
        status: 'processing',
        url,
        completed: firecrawlData.completed || 0,
        total: firecrawlData.total || 0,
        creditsUsed: firecrawlData.creditsUsed || 0,
        expiresAt: firecrawlData.expiresAt
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

function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    auth: {
      getUser: async (token: string) => {
        try {
          const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: supabaseKey
            }
          });
          
          if (!response.ok) {
            return { data: {}, error: new Error('Failed to get user') };
          }
          
          const user = await response.json();
          return { data: { user }, error: null };
        } catch (error) {
          return { data: {}, error };
        }
      }
    },
    from: (table: string) => {
      return {
        insert: (data: any) => {
          const query = {
            table,
            data,
            returning: '*'
          };
          
          return {
            select: () => {
              return {
                single: async () => {
                  try {
                    const databaseUrl = `${supabaseUrl}/rest/v1/${table}`;
                    const response = await fetch(databaseUrl, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation',
                        Authorization: `Bearer ${supabaseKey}`,
                        apikey: supabaseKey
                      },
                      body: JSON.stringify(data)
                    });
                    
                    if (!response.ok) {
                      return { data: null, error: new Error('Failed to insert data') };
                    }
                    
                    const responseData = await response.json();
                    return { data: responseData[0], error: null };
                  } catch (error) {
                    return { data: null, error };
                  }
                }
              };
            }
          };
        }
      };
    }
  };
}
