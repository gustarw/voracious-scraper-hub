
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Code2, RefreshCw, Save, Key } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";

interface APIKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
}

export default function IntegracaoAPIs() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAPIKeys();
  }, [user]);

  const fetchAPIKeys = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Erro ao carregar chaves API",
        description: "Não foi possível carregar suas chaves API. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (!user || !newKeyName.trim()) return;

    try {
      setIsLoading(true);
      const newKey = crypto.randomUUID();
      const { error } = await supabase
        .from('api_keys')
        .insert([{
          user_id: user.id,
          name: newKeyName.trim(),
          key: newKey,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Chave API criada",
        description: "Sua nova chave API foi criada com sucesso."
      });

      setNewKeyName('');
      fetchAPIKeys();
    } catch (error) {
      console.error('Error generating API key:', error);
      toast({
        title: "Erro ao criar chave API",
        description: "Não foi possível criar a chave API. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', keyId);

      if (error) throw error;

      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? { ...key, is_active: !currentStatus } : key
      ));

      toast({
        title: "Status atualizado",
        description: `Chave API ${!currentStatus ? 'ativada' : 'desativada'} com sucesso.`
      });
    } catch (error) {
      console.error('Error toggling API key status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da chave API.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast({
        title: "Copiado!",
        description: "Chave API copiada para a área de transferência."
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a chave API.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integração com APIs</h1>
        <p className="text-scrapvorn-gray">
          Gerencie suas chaves de API para integração com nossos serviços.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="bg-white/5 border border-scrapvorn-gray/10">
          <CardHeader>
            <CardTitle>Criar Nova Chave API</CardTitle>
            <CardDescription>
              Gere uma nova chave API para integrar com nossos serviços.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="api-key-name">Nome da Chave API</Label>
                <Input
                  id="api-key-name"
                  placeholder="Ex: Integração Website"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateNewKey}
                  disabled={isLoading || !newKeyName.trim()}
                  className="w-full sm:w-auto bg-scrapvorn-orange hover:bg-scrapvorn-orange/90"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Gerar Nova Chave
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-scrapvorn-gray/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Suas Chaves API</CardTitle>
                <CardDescription>
                  Gerencie suas chaves API existentes.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchAPIKeys}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-scrapvorn-gray">
                  <Code2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Nenhuma chave API encontrada.</p>
                  <p className="text-sm">Crie uma nova chave para começar.</p>
                </div>
              ) : (
                apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-black/20 rounded-lg gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{apiKey.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          apiKey.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {apiKey.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-black/40 px-2 py-1 rounded">
                          {apiKey.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          Copiar
                        </Button>
                      </div>
                      <p className="text-xs text-scrapvorn-gray">
                        Criada em: {new Date(apiKey.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={apiKey.is_active}
                          onCheckedChange={() => toggleKeyStatus(apiKey.id, apiKey.is_active)}
                        />
                        <Label className="text-sm">
                          {apiKey.is_active ? 'Ativa' : 'Inativa'}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-scrapvorn-gray/10">
          <CardHeader>
            <CardTitle>Documentação da API</CardTitle>
            <CardDescription>
              Aprenda como integrar nossos serviços usando as APIs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h3>Endpoints Disponíveis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Iniciar Nova Extração</h4>
                  <pre className="bg-black/40 p-4 rounded overflow-x-auto">
                    <code>
                      POST /api/v1/extractions/start
                      {`
{
  "url": "https://exemplo.com",
  "apiKey": "sua-chave-api"
}`}
                    </code>
                  </pre>
                </div>

                <div className="p-4 bg-black/20 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Verificar Status da Extração</h4>
                  <pre className="bg-black/40 p-4 rounded overflow-x-auto">
                    <code>
                      GET /api/v1/extractions/:id
                      {`
Headers:
  Authorization: Bearer sua-chave-api`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
