
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

interface PlanFeature {
  text: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onChangePlan: (planId: string) => void;
}

export const SubscriptionPlanCard = ({ plan, onChangePlan }: SubscriptionPlanCardProps) => {
  return (
    <Card 
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
          onClick={() => onChangePlan(plan.id)}
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
  );
};
