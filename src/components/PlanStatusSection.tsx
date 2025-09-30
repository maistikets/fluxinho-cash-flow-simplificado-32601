
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, AlertTriangle } from 'lucide-react';
import { getTrialDaysLeft, isTrialExpired } from '@/utils/trialHelpers';

const PlanStatusSection = () => {
  const { user } = useAuth();

  const getRemainingDays = () => {
    if (!user?.trialEndDate) return 0;
    return getTrialDaysLeft(user);
  };

  const getNextRenewalDate = () => {
    if (user?.planType === 'premium' || user?.planType === 'basic') {
      const nextRenewal = new Date();
      nextRenewal.setDate(nextRenewal.getDate() + 30);
      return nextRenewal.toLocaleDateString('pt-BR');
    }
    return null;
  };

  const getDaysUntilRenewal = () => {
    if (user?.planType === 'premium' || user?.planType === 'basic') {
      return Math.floor(Math.random() * 30) + 1;
    }
    return null;
  };

  const isRenewalSoon = () => {
    const days = getDaysUntilRenewal();
    return days !== null && days <= 7;
  };

  const remainingDays = getRemainingDays();
  const nextRenewalDate = getNextRenewalDate();
  const daysUntilRenewal = getDaysUntilRenewal();
  const userTrialExpired = user ? isTrialExpired(user) : false;
  const renewalSoon = isRenewalSoon();

  return (
    <>
      {/* Avisos de renovação */}
      {renewalSoon && (user?.planType === 'premium' || user?.planType === 'basic') && (
        <div className="p-4 rounded-lg border bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <h3 className="font-medium text-orange-700">
                Renovação em {daysUntilRenewal} {daysUntilRenewal === 1 ? 'dia' : 'dias'}
              </h3>
              <p className="text-sm text-orange-600">
                Sua assinatura será renovada automaticamente em {nextRenewalDate}. 
                Certifique-se de que seu método de pagamento está atualizado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Aviso de trial */}
      {user?.planType === 'trial' && (
        <div className={`p-4 rounded-lg border ${
          userTrialExpired 
            ? 'bg-red-50 border-red-200' 
            : remainingDays <= 2 
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            {userTrialExpired ? (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            ) : (
              <Clock className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <h3 className={`font-medium ${
                userTrialExpired ? 'text-red-700' : 'text-blue-700'
              }`}>
                {userTrialExpired 
                  ? 'Seu teste gratuito expirou'
                  : `${remainingDays} ${remainingDays === 1 ? 'dia restante' : 'dias restantes'}`
                }
              </h3>
              <p className={`text-sm ${
                userTrialExpired ? 'text-red-600' : 'text-blue-600'
              }`}>
                {userTrialExpired 
                  ? 'Faça upgrade para continuar usando todas as funcionalidades'
                  : 'Após o término, você pode escolher um plano para continuar'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanStatusSection;
