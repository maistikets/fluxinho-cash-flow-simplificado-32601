
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { isTrialExpired } from '@/utils/trialHelpers';

const PlanHistorySection = () => {
  const { user } = useAuth();

  const getPlanName = () => {
    switch (user?.planType) {
      case 'trial':
        return isTrialExpired(user) ? 'Teste Expirado' : 'Teste Gratuito';
      case 'premium':
        return 'Trimestral';
      case 'basic':
        return 'Mensal';
      case 'annual':
        return 'Anual';
      default:
        return 'Gratuito';
    }
  };

  const getNextRenewalDate = () => {
    if (user?.planType === 'premium' || user?.planType === 'basic') {
      const nextRenewal = new Date();
      nextRenewal.setDate(nextRenewal.getDate() + 30);
      return nextRenewal.toLocaleDateString('pt-BR');
    }
    return null;
  };

  const getPlanBadgeColor = () => {
    switch (user?.planType) {
      case 'trial':
        return isTrialExpired(user) ? 'destructive' : 'secondary';
      case 'premium':
        return 'default';
      case 'basic':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const nextRenewalDate = getNextRenewalDate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Planos</CardTitle>
        <CardDescription>Acompanhe o histórico dos seus planos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{getPlanName()}</p>
              <p className="text-sm text-gray-600">
                {user?.trialStartDate 
                  ? `Desde ${new Date(user.trialStartDate).toLocaleDateString('pt-BR')}`
                  : 'Plano atual'
                }
                {nextRenewalDate && (
                  <span className="ml-2 text-blue-600">
                    • Renova em {nextRenewalDate}
                  </span>
                )}
              </p>
            </div>
            <Badge variant={getPlanBadgeColor()}>
              Ativo
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanHistorySection;
