
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apwmtaqxzeivcxmwmszd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd210YXF4emVpdmN4bXdtc3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTkwMjQsImV4cCI6MjA1NjYzNTAyNH0.i9_QpOMl8vy0HhDw1Z9hqB6r88yL9rFi20Ndot751vo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Create storage bucket for avatars if it doesn't exist
const createAvatarBucket = async () => {
  try {
    const { data, error } = await supabase.storage.getBucket('avatars');
    
    // If the bucket doesn't exist (404 error), create it
    if (error && error.message.includes('does not exist')) {
      console.log('Creating avatars bucket...');
      const { error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating avatars bucket:', createError);
      } else {
        console.log('Avatars bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Unexpected error checking for avatars bucket:', error);
  }
};

// Run this when the application starts
createAvatarBucket();
