
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useProfileAvatar = (userId: string | undefined, onSuccess: (url: string) => void) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File) => {
    if (!file || !userId) return null;
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}.${fileExt}`;
      
      let fileToUpload = file;
      
      // Compress large images
      if (file.size > 1024 * 1024) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
        
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.8);
        });
        
        fileToUpload = new File([blob], fileName, { type: 'image/jpeg' });
      }

      console.log("Uploading avatar to storage...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileToUpload, {
          upsert: true,
          contentType: fileToUpload.type,
          cacheControl: '3600'
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Avatar uploaded, getting public URL...");
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      if (!urlData?.publicUrl) {
        throw new Error('URL pública não gerada');
      }
      
      console.log("Public URL generated:", urlData.publicUrl);
      
      onSuccess(urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível fazer o upload da imagem. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadAvatar
  };
};
