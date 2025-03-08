
export const subscriptionPlans = [
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
