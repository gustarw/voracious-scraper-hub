
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

// Imported components
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { ProfileLoadingSpinner } from "@/components/profile/ProfileLoadingSpinner";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";

const Perfil = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { uploading: avatarUploading, uploadAvatar } = useProfileAvatar(
    user?.id,
    (url) => setAvatarUrl(url)
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Sessão não encontrada, redirecionando...');
          navigate('/login');
          return;
        }
        
        console.log('Sessão encontrada, atualizando perfil...');
        
        await refreshProfile();
        
        if (!profile) {
          console.log('Perfil não encontrado após refresh');
          toast({
            title: 'Perfil não encontrado',
            description: 'Não foi possível encontrar seu perfil. Entre em contato com o suporte.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        toast({
          title: 'Erro de autenticação',
          description: 'Ocorreu um erro ao verificar sua sessão. Tente novamente.',
          variant: 'destructive'
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, refreshProfile, toast]);

  // Update local state when profile data changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || null);
      console.log("Profile updated, avatar URL:", profile.avatar_url);
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !profile) {
      setIsLoading(false);
    }
  }, [loading, profile]);

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    
    // Create a local preview URL for immediate feedback
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const updates: {
        username: string;
        avatar_url: string | null;
        updated_at: string;
      } = {
        username,
        avatar_url: profile?.avatar_url || null,
        updated_at: new Date().toISOString()
      };
      
      // If user has selected a new avatar, upload it
      if (avatarFile) {
        console.log("New avatar file selected, uploading...");
        const newAvatarUrl = await uploadAvatar(avatarFile);
        if (newAvatarUrl) {
          console.log("New avatar URL:", newAvatarUrl);
          updates.avatar_url = newAvatarUrl;
        }
      }
      
      const hasChanges = 
        updates.username !== profile?.username ||
        updates.avatar_url !== profile?.avatar_url;
      
      if (!hasChanges) {
        toast({
          title: "Nenhuma alteração detectada",
          description: "Não há mudanças para salvar."
        });
        return;
      }
      
      console.log("Updating profile with:", updates);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Clear the file selection after successful upload
      setAvatarFile(null);
      
      // Refresh profile data from server
      await refreshProfile();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return <ProfileLoadingSpinner />;
  }

  if (!user || !profile) {
    console.log('Usuário ou perfil não encontrado');
    return <ProfileNotFound />;
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Perfil do Usuário</h1>
        <p className="text-scrapvorn-gray">
          Gerencie suas informações pessoais.
        </p>
      </div>
      
      <div className="bg-black/20 p-6 rounded-xl border border-scrapvorn-orange/20 mb-6">
        <div className="flex items-center mb-4">
          <User className="mr-2 h-5 w-5 text-scrapvorn-orange" />
          <h2 className="text-xl font-semibold text-white">Informações Pessoais</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileAvatar 
            avatarUrl={avatarUrl} 
            username={username}
            onAvatarChange={handleAvatarChange}
            isUploading={avatarUploading}
          />
          
          <ProfileDetails 
            email={user?.email || ""}
            username={username}
            onUsernameChange={(e) => setUsername(e.target.value)}
            onSave={handleSaveProfile}
            isSaving={isSaving}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;
