
import { supabase } from "@/lib/supabase";
import { Profile } from "./types";

// Function to fetch user profile from database with optimized query
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, avatar_url, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
};

// Create storage bucket for avatars if it doesn't exist
export const setupAvatarBucket = async () => {
  try {
    const { data, error } = await supabase.storage.getBucket('avatars');
    
    // If the bucket doesn't exist (error message contains 'does not exist'), create it
    if (error && error.message && error.message.includes('does not exist')) {
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
