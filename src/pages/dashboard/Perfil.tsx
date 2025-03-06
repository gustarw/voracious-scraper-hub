
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  User, 
  Upload, 
  Check, 
  ArrowRight, 
  ImageIcon 
} from "lucide-react";

const Perfil = () => {
  const { user, profile, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Set initial values when profile loads
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar to Supabase storage
  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    
    try {
      setAvatarUploading(true);
      
      // Create a unique file path for the avatar
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the avatar
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível fazer o upload da imagem. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Upload avatar if a new file was selected
      let avatar_url = profile?.avatar_url || null;
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar();
        if (newAvatarUrl) {
          avatar_url = newAvatarUrl;
        }
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      // Force reload to update the UI with new profile data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Plans array for display
  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: "Grátis",
      features: [
        "5 scrapes por dia",
        "Exportação em CSV",
        "Suporte por email"
      ],
      current: true
    },
    {
      id: "pro",
      name: "Profissional",
      price: "R$ 49/mês",
      features: [
        "100 scrapes por dia",
        "Exportação em CSV e JSON",
        "Agendamento de tarefas",
        "Suporte prioritário",
      ],
      current: false
    },
    {
      id: "enterprise",
      name: "Empresarial",
      price: "R$ 199/mês",
      features: [
        "Scrapes ilimitados",
        "Todos os formatos de exportação",
        "API dedicada",
        "Suporte 24/7",
        "Treinamento personalizado"
      ],
      current: false
    }
  ];
  
  const handleChangePlan = (planId: string) => {
    navigate("/dashboard/assinatura?plan=" + planId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Perfil do Usuário</h1>
        <p className="text-scrapvorn-gray">
          Gerencie suas informações pessoais e plano de assinatura.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-scrapvorn-gray/10">
          <TabsTrigger value="profile" className="data-[state=active]:bg-scrapvorn-orange/10">
            <User className="mr-2 h-4 w-4" />
            Informações Pessoais
          </TabsTrigger>
          <TabsTrigger value="plan" className="data-[state=active]:bg-scrapvorn-orange/10">
            <CreditCard className="mr-2 h-4 w-4" />
            Plano de Assinatura
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-white/5 border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>
                  Sua foto atual exibida em toda a plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-6">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="bg-scrapvorn-orange text-black text-2xl">
                    {username ? username.substring(0, 2).toUpperCase() : (
                      <ImageIcon className="w-12 h-12 text-black/50" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className="w-full">
                  <Label 
                    htmlFor="avatar" 
                    className="w-full cursor-pointer flex items-center justify-center gap-2 py-2 border border-dashed border-scrapvorn-gray/30 rounded-md hover:bg-white/5 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Carregar Imagem
                  </Label>
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <p className="text-xs text-scrapvorn-gray mt-2 text-center">
                    Formatos suportados: JPG, PNG, GIF (max. 2MB)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-white/5 border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle>Detalhes do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ""} 
                      disabled 
                      className="bg-scrapvorn-gray/10"
                    />
                    <p className="text-xs text-scrapvorn-gray">
                      O email não pode ser alterado.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Seu nome de usuário"
                      className="bg-black border-scrapvorn-gray/20 focus:border-scrapvorn-orange/50"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving || avatarUploading} 
                    className="w-full mt-4 bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium"
                  >
                    {isSaving || avatarUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : "Salvar Alterações"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="plan">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`bg-white/5 border-scrapvorn-gray/10 ${
                  plan.current ? "ring-2 ring-scrapvorn-orange" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.current && (
                      <Badge className="bg-scrapvorn-orange text-black">Atual</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold">{plan.price}</div>
                  <CardDescription>
                    {plan.current ? "Seu plano atual" : "Mude para este plano"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-scrapvorn-orange mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleChangePlan(plan.id)}
                    className={plan.current 
                      ? "w-full bg-scrapvorn-gray/20 text-scrapvorn-gray hover:bg-scrapvorn-gray/30 cursor-default"
                      : "w-full bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium"
                    }
                    disabled={plan.current}
                  >
                    {plan.current ? "Plano Atual" : (
                      <>
                        Mudar para {plan.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Perfil;
