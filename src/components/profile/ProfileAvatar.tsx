
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  username: string;
  onAvatarChange: (file: File) => void;
  isUploading: boolean;
}

export const ProfileAvatar = ({ 
  avatarUrl, 
  username, 
  onAvatarChange, 
  isUploading 
}: ProfileAvatarProps) => {
  const { toast } = useToast();
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O avatar deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }
      
      onAvatarChange(file);
    }
  };

  return (
    <Card className="md:col-span-1 bg-white/5 border-scrapvorn-gray/10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Foto de Perfil</CardTitle>
        <CardDescription className="text-scrapvorn-gray">
          Sua foto atual exibida em toda a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-32 h-32 relative rounded-full mb-6 bg-scrapvorn-orange/10 overflow-hidden border-2 border-scrapvorn-orange/30 p-1">
          <Avatar className="w-full h-full">
            {avatarUrl ? (
              <AvatarImage 
                src={avatarUrl} 
                alt="Avatar do usuário"
                className="object-cover"
                onError={(e) => {
                  console.error("Error loading avatar image");
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <AvatarFallback className="bg-scrapvorn-orange text-black text-2xl">
              {username ? username.substring(0, 2).toUpperCase() : (
                <ImageIcon className="w-12 h-12 text-black/50" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="w-full">
          <Label 
            htmlFor="avatar" 
            className="group w-full cursor-pointer flex items-center justify-center gap-2 py-3 border border-dashed border-scrapvorn-orange/30 rounded-md hover:bg-scrapvorn-orange/10 transition-colors text-white/70 hover:text-white"
          >
            <Upload className="h-4 w-4 text-scrapvorn-orange" />
            {isUploading ? 'Enviando...' : 'Carregar Nova Imagem'}
          </Label>
          <Input 
            id="avatar" 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange}
            className="hidden"
            disabled={isUploading}
          />
          <p className="text-xs text-white/50 mt-2 text-center">
            Formatos suportados: JPG, PNG, GIF (max. 5MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
