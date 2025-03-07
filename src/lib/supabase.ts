
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apwmtaqxzeivcxmwmszd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd210YXF4emVpdmN4bXdtc3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTkwMjQsImV4cCI6MjA1NjYzNTAyNH0.i9_QpOMl8vy0HhDw1Z9hqB6r88yL9rFi20Ndot751vo';

export const supabase = createClient(supabaseUrl, supabaseKey);
