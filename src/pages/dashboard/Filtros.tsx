
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

type FilterRule = {
  id: string;
  type: "include" | "exclude";
  value: string;
};

const Filtros = () => {
  const [filterRules, setFilterRules] = useState<FilterRule[]>([
    { id: "1", type: "include", value: "produto" },
    { id: "2", type: "exclude", value: "indisponível" },
  ]);
  
  const [newRule, setNewRule] = useState("");
  const [ruleType, setRuleType] = useState<"include" | "exclude">("include");

  const addRule = () => {
    if (!newRule.trim()) return;
    
    setFilterRules([
      ...filterRules,
      { id: Date.now().toString(), type: ruleType, value: newRule.trim() }
    ]);
    
    setNewRule("");
  };

  const removeRule = (id: string) => {
    setFilterRules(filterRules.filter(rule => rule.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Filtros</h1>
        <p className="text-scrapvorn-gray">
          Configure filtros avançados para refinar os dados extraídos.
        </p>
      </div>
      
      <Tabs defaultValue="keywords" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="keywords">Filtros por Palavras-chave</TabsTrigger>
          <TabsTrigger value="patterns">Padrões Regex</TabsTrigger>
          <TabsTrigger value="selectors">Seletores CSS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keywords">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Filtrar por Palavras-chave</CardTitle>
              <CardDescription>
                Adicione palavras-chave para incluir ou excluir resultados específicos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <Toggle
                        pressed={ruleType === "include"}
                        onPressedChange={() => setRuleType("include")}
                        className="data-[state=on]:bg-green-600"
                      >
                        Incluir
                      </Toggle>
                      <Toggle
                        pressed={ruleType === "exclude"}
                        onPressedChange={() => setRuleType("exclude")}
                        className="data-[state=on]:bg-red-600"
                      >
                        Excluir
                      </Toggle>
                    </div>
                    
                    <div className="flex flex-1 gap-2">
                      <Input
                        placeholder="Adicionar palavra-chave"
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && addRule()}
                      />
                      <Button 
                        onClick={addRule}
                        className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-scrapvorn-gray/10" />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium mb-4">Filtros Ativos</h3>
                    
                    {filterRules.length === 0 ? (
                      <p className="text-scrapvorn-gray">Nenhum filtro definido.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {filterRules.map((rule) => (
                          <Badge 
                            key={rule.id}
                            className={`flex items-center gap-1 py-1.5 px-3 ${
                              rule.type === "include" 
                                ? "bg-green-600/20 text-green-400 hover:bg-green-600/30" 
                                : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                            }`}
                          >
                            {rule.type === "include" ? "+" : "-"} {rule.value}
                            <Trash2 
                              className="ml-1 h-3 w-3 cursor-pointer" 
                              onClick={() => removeRule(rule.id)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patterns">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Filtrar por Padrões Regex</CardTitle>
              <CardDescription>
                Use expressões regulares para filtragem avançada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                <p className="text-scrapvorn-gray mb-4">Filtros por regex em desenvolvimento</p>
                <Button variant="outline">Seja notificado quando disponível</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="selectors">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Filtrar por Seletores CSS</CardTitle>
              <CardDescription>
                Defina seletores CSS específicos para filtrar elementos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                <p className="text-scrapvorn-gray mb-4">Filtros por seletores CSS em desenvolvimento</p>
                <Button variant="outline">Seja notificado quando disponível</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Filtros;
