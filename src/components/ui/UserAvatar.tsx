
import { useAuth } from "@/context/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface UserAvatarProps {
  className?: string;
}

export const UserAvatar = ({ className }: UserAvatarProps) => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      // Forçar recarregamento da página após o logout para limpar o estado
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }
    
    try {
      setUploading(true);
      const file = event.target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O avatar deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      console.log("Uploading avatar from UserAvatar component...");
      
      // Upload avatar to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      if (!urlData.publicUrl) {
        throw new Error("Falha ao obter URL pública");
      }
      
      console.log("Public URL obtained:", urlData.publicUrl);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Refresh profile data
      await refreshProfile();
      
      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi atualizado com sucesso"
      });
    } catch (error: any) {
      console.error("Erro ao atualizar avatar:", error);
      toast({
        title: "Erro ao atualizar avatar",
        description: error.message || "Ocorreu um erro ao atualizar seu avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const getInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "US";
  };
  
  // Add loading state to avatar if profile is missing
  const avatarUrl = profile?.avatar_url;
  
  console.log("UserAvatar rendering with URL:", avatarUrl);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={`cursor-pointer ${className}`}>
          {avatarUrl ? (
            <AvatarImage 
              src={avatarUrl} 
              alt="Avatar do usuário"
              onError={(e) => {
                console.error("Error loading avatar image in dropdown");
                // Optional: add fallback logic here
              }}
            />
          ) : null}
          <AvatarFallback className="bg-scrapvorn-orange text-black">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Upload Avatar Option */}
        <div className="px-2 py-1.5">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-sm font-normal"
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Enviando..." : "Atualizar Avatar"}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </Button>
          </div>
        </div>
        
        <DropdownMenuItem onClick={() => navigate("/dashboard/perfil")}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard/configuracoes")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
