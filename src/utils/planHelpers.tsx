import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { Plan } from '@/contexts/PlansContext';

export const getPlanBadge = (planType: string, isActive: boolean, plans: Plan[]): JSX.Element => {
  if (!isActive) return <Badge variant="destructive">Inativo</Badge>;
  
  const plan = plans.find(p => p.id === planType);
  if (!plan) return <Badge variant="secondary">Desconhecido</Badge>;

  switch (planType) {
    case 'trial':
      return <Badge className="bg-blue-100 text-blue-800">{plan.name}</Badge>;
    case 'basic':
      return <Badge variant="outline">{plan.name}</Badge>;
    case 'premium':
      return <Badge className="bg-purple-100 text-purple-800">{plan.name}</Badge>;
    case 'annual':
      return <Badge className="bg-green-100 text-green-800">{plan.name}</Badge>;
    default:
      return <Badge variant="secondary">{plan.name}</Badge>;
  }
};

export const getRoleBadge = (role: string): JSX.Element => {
  if (role === 'admin') {
    return (
      <Badge className="bg-red-100 text-red-800">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  }
  return <Badge variant="outline">Usuário</Badge>;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const calculateSubscriptionTime = (startDate: string): string => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} mês${months > 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ano${years > 1 ? 's' : ''}`;
  }
};

export const getStatusBadge = (user: any): JSX.Element => {
  if (user.isActive) {
    return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
  } else if (user.isTrialExpired) {
    return <Badge variant="destructive">Teste Expirado</Badge>;
  } else {
    return <Badge variant="secondary">Inativo</Badge>;
  }
};
