import React from "react";

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
        <div key={plan.id} className="bg-white/5 border border-scrapvorn-gray/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            {plan.current && (
              <span className="bg-scrapvorn-orange/90 text-black text-xs font-medium px-2 py-1 rounded">
                Atual
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-2">{plan.price}</div>
          <p className="text-scrapvorn-gray mb-4">
            {plan.current ? "Seu plano atual" : "Mude para este plano"}
          </p>
          <ul className="space-y-2 mb-6">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <svg
                  className="h-5 w-5 text-scrapvorn-orange mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-scrapvorn-gray">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onChangePlan(plan.id)}
            disabled={plan.current}
            className={`w-full py-2 px-4 rounded ${
              plan.current
                ? "bg-black/30 text-scrapvorn-gray cursor-not-allowed"
                : "bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium transition-colors"
            }`}
          >
            {plan.current ? "Plano Atual" : `Mudar para ${plan.name}`}
          </button>
        </div>
      ))}
    </div>
  );
};
