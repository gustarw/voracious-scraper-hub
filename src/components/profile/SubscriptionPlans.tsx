
import React from "react";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

interface SubscriptionPlansProps {
  plans: Plan[];
  onChangePlan: (planId: string) => void;
}

export const SubscriptionPlans = ({ plans, onChangePlan }: SubscriptionPlansProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <SubscriptionPlanCard 
          key={plan.id} 
          plan={plan} 
          onChangePlan={onChangePlan} 
        />
      ))}
    </div>
  );
};
