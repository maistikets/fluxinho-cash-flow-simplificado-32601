
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  originalPrice?: string;
  features: string[];
  highlight: boolean;
  badge?: string;
  active: boolean;
  order: number;
}

interface PlansContextType {
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  togglePlanStatus: (id: string) => void;
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

const defaultPlans: Plan[] = [
  {
    id: 'trial',
    name: 'Teste Gratuito',
    description: 'Teste por 7 dias',
    price: 'R$ 0',
    period: '7 dias grátis',
    features: [
      'Até 50 transações',
      'Relatórios básicos',
      'Dashboard completo',
      'Suporte por email'
    ],
    highlight: false,
    badge: 'Teste Grátis',
    active: true,
    order: 1
  },
  {
    id: 'basic',
    name: 'Mensal',
    description: 'Plano mensal',
    price: 'R$ 29,90',
    period: 'por mês',
    features: [
      'Transações ilimitadas',
      'Relatórios básicos',
      'Dashboard completo',
      'Suporte por email'
    ],
    highlight: false,
    active: true,
    order: 2
  },
  {
    id: 'premium',
    name: 'Trimestral',
    description: 'Economia de 15%',
    price: 'R$ 76,23',
    period: 'por trimestre',
    originalPrice: 'R$ 89,70',
    features: [
      'Transações ilimitadas',
      'Relatórios avançados',
      'Dashboard premium',
      'Suporte prioritário',
      'Backup automático',
      'Integrações bancárias',
      '15% de desconto'
    ],
    highlight: true,
    badge: 'Mais Popular',
    active: true,
    order: 3
  },
  {
    id: 'annual',
    name: 'Anual',
    description: 'Melhor valor - 33% OFF',
    price: 'R$ 239,28',
    period: 'por ano',
    originalPrice: 'R$ 358,80',
    features: [
      'Transações ilimitadas',
      'Relatórios avançados',
      'Dashboard premium',
      'Suporte prioritário',
      'Backup automático',
      'Integrações bancárias',
      '33% de desconto',
      'Consultoria gratuita'
    ],
    highlight: false,
    badge: 'Maior Economia',
    active: true,
    order: 4
  }
];

export const PlansProvider = ({ children }: { children: React.ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('admin-plans');
    return saved ? JSON.parse(saved) : defaultPlans;
  });

  useEffect(() => {
    localStorage.setItem('admin-plans', JSON.stringify(plans));
  }, [plans]);

  const addPlan = (newPlan: Omit<Plan, 'id'>) => {
    const plan: Plan = {
      ...newPlan,
      id: Date.now().toString(),
    };
    setPlans(prev => [...prev, plan].sort((a, b) => a.order - b.order));
  };

  const updatePlan = (id: string, updatedPlan: Partial<Plan>) => {
    setPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, ...updatedPlan } : plan
    ).sort((a, b) => a.order - b.order));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const togglePlanStatus = (id: string) => {
    updatePlan(id, { active: !plans.find(p => p.id === id)?.active });
  };

  return (
    <PlansContext.Provider value={{
      plans,
      addPlan,
      updatePlan,
      deletePlan,
      togglePlanStatus
    }}>
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error('usePlans must be used within PlansProvider');
  }
  return context;
};
