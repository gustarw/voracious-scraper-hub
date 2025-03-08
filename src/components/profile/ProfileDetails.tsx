
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileDetailsProps {
  email: string;
  username: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ProfileDetails = ({
  email,
  username,
  onUsernameChange,
  onSave,
  isSaving
}: ProfileDetailsProps) => {
  return (
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
              value={email || ""} 
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
              onChange={onUsernameChange} 
              placeholder="Seu nome de usuário"
              className="bg-black/40 border-scrapvorn-orange/30 focus:border-scrapvorn-orange/70 text-white placeholder:text-white/30 transition-colors"
            />
          </div>
          
          <Button 
            onClick={onSave}
            disabled={isSaving} 
            className="w-full mt-4 bg-gradient-to-r from-scrapvorn-orange to-scrapvorn-orange/90 hover:from-scrapvorn-orange/90 hover:to-scrapvorn-orange shadow-lg shadow-scrapvorn-orange/20 hover:shadow-scrapvorn-orange/30 text-black font-medium transition-all duration-300"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
