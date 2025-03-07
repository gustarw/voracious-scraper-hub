import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase"; // Updated import path
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
  const { user, profile, loading, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar autenticação e redirecionar se necessário
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Verificar se temos uma sessão válida
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Sessão não encontrada, redirecionando...');
          navigate('/login');
          return;
        }
        
        console.log('Sessão encontrada, atualizando perfil...');
        
        // Atualizar o perfil usando a função do contexto
        await refreshProfile();
        
        // Verificar se temos um perfil
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
  }, [navigate, refreshProfile, toast]); // Adicionando dependências necessárias
  
  // Atualizar estados locais quando o perfil mudar
  useEffect(() => {
    console.log('Perfil atualizado:', profile);
    if (profile) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || null);
      setIsLoading(false); // Garantir que o loading termine quando o perfil estiver disponível
    }
  }, [profile]);
  
  // Garantir que o loading termine mesmo se não houver perfil
  useEffect(() => {
    if (!loading && !profile) {
      setIsLoading(false);
    }
  }, [loading, profile]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Arquivo muito grande",
          description: "O avatar deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Upload otimizado do avatar
  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    
    try {
      setAvatarUploading(true);
      
      // Criar nome do arquivo
      const fileExt = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}.${fileExt}`;
      
      // Comprimir imagem se necessário
      let fileToUpload = avatarFile;
      if (avatarFile.size > 1024 * 1024) { // > 1MB
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(avatarFile);
        });
        
        // Calcular dimensões mantendo proporção
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
        
        // Converter para Blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.8);
        });
        
        fileToUpload = new File([blob], fileName, { type: 'image/jpeg' });
      }

      // Upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileToUpload, {
          upsert: true,
          contentType: fileToUpload.type,
          cacheControl: '3600'
        });
        
      if (uploadError) throw uploadError;
      
      // Gerar URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      if (!urlData?.publicUrl) {
        throw new Error('URL pública não gerada');
      }
      
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
      setAvatarUploading(false);
    }
  };

  // Salvar alterações do perfil de forma otimizada
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Preparar dados para atualização
      const updates: {
        username: string;
        avatar_url: string | null;
        updated_at: string;
      } = {
        username,
        avatar_url: profile?.avatar_url || null,
        updated_at: new Date().toISOString()
      };
      
      // Upload do avatar se necessário
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar();
        if (newAvatarUrl) {
          updates.avatar_url = newAvatarUrl;
        }
      }
      
      // Verificar se há mudanças reais
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
      
      // Atualizar perfil no Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Limpar estados locais
      if (avatarFile) {
        setAvatarFile(null);
        setAvatarUrl(updates.avatar_url);
      }
      
      // Atualizar contexto e notificar usuário
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

  // Componente de loading memoizado
  const LoadingSpinner = React.memo(() => (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-scrapvorn-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    </DashboardLayout>
  ));

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    console.log('Usuário ou perfil não encontrado');
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-white/70">Sessão expirada ou inválida.</p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90"
          >
            Fazer Login
          </Button>
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
        <TabsList className="mb-6 bg-black/40 p-1 rounded-md border border-scrapvorn-orange/20">
          <TabsTrigger value="profile" className="data-[state=active]:bg-scrapvorn-orange/20 data-[state=active]:text-white hover:bg-scrapvorn-orange/10 transition-colors">
            <User className="mr-2 h-4 w-4 text-scrapvorn-orange" />
            Informações Pessoais
          </TabsTrigger>
          <TabsTrigger value="plan" className="data-[state=active]:bg-scrapvorn-orange/20 data-[state=active]:text-white hover:bg-scrapvorn-orange/10 transition-colors">
            <CreditCard className="mr-2 h-4 w-4 text-scrapvorn-orange" />
            Plano de Assinatura
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-white/5 border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle className="text-white">Foto de Perfil</CardTitle>
                <CardDescription className="text-scrapvorn-gray">
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
                    className="group w-full cursor-pointer flex items-center justify-center gap-2 py-2 border border-dashed border-scrapvorn-gray/30 rounded-md hover:bg-white/5 transition-colors text-white/70 hover:text-white"
                  >
                    <Upload className="h-4 w-4 text-white/70 group-hover:text-white" />
                    Carregar Imagem
                  </Label>
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <p className="text-xs text-white/50 mt-2 text-center">
                    Formatos suportados: JPG, PNG, GIF (max. 2MB)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-white/5 border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle>Detalhes do Perfil</CardTitle>
                <CardDescription className="text-white/50">
                  Atualize suas informações pessoais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white/70">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ""} 
                      disabled 
                      className="bg-black/40 border-scrapvorn-gray/30 text-white/60"
                    />
                    <p className="text-xs text-white/50">
                      O email não pode ser alterado.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="username" className="text-white/70">Nome de usuário</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Seu nome de usuário"
                      className="bg-black/40 border-scrapvorn-orange/30 focus:border-scrapvorn-orange/70 text-white placeholder:text-white/30 transition-colors"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving || avatarUploading} 
                    className="w-full mt-4 bg-gradient-to-r from-scrapvorn-orange to-scrapvorn-orange/90 hover:from-scrapvorn-orange/90 hover:to-scrapvorn-orange shadow-lg shadow-scrapvorn-orange/20 hover:shadow-scrapvorn-orange/30 text-black font-medium transition-all duration-300"
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
                className={`bg-black/20 border-scrapvorn-gray/10 ${
                  plan.current ? "ring-2 ring-scrapvorn-orange" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    {plan.current && (
                      <Badge className="bg-scrapvorn-orange/90 text-black font-medium">Atual</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white">{plan.price}</div>
                  <CardDescription>
                    {plan.current ? "Seu plano atual" : "Mude para este plano"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-scrapvorn-orange mr-2 flex-shrink-0" />
                        <span className="text-scrapvorn-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleChangePlan(plan.id)}
                    className={plan.current 
                      ? "w-full bg-black/30 text-scrapvorn-gray hover:bg-black/40 cursor-default"
                      : "w-full bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium transition-colors"
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
