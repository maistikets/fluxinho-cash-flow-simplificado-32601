import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlans } from '@/contexts/PlansContext';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PlanHeader from '@/components/PlanHeader';
import TrialExpiredBanner from '@/components/TrialExpiredBanner';
import SystemPurposeBanner from '@/components/SystemPurposeBanner';
import PlanCard from '@/components/PlanCard';

const PlanSelection = () => {
  const { user, isTrialExpired, getTrialDaysLeft } = useAuth();
  const { plans } = usePlans();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectPlan = (planId: string) => {
    if (planId === 'trial') {
      if (!user) {
        navigate('/login');
        return;
      }
      toast({
        title: "Teste já ativo",
        description: "Você já possui um período de teste.",
      });
      navigate('/dashboard');
      return;
    }

    if (!user) {
      localStorage.setItem('selectedPlan', planId);
      navigate('/login');
      return;
    }

    navigate('/checkout', { state: { planId } });
  };

  const trialDaysLeft = getTrialDaysLeft();
  const userTrialExpired = isTrialExpired();

  return (
    <div className="min-h-screen bg-gray-50">
      <PlanHeader showBackButton={!!user} backPath="/dashboard" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user && userTrialExpired && <TrialExpiredBanner />}
          {(!user || (user.planType === 'trial' && !userTrialExpired)) && <SystemPurposeBanner />}
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {userTrialExpired ? 'Continue sua Jornada - Escolha seu Plano' : 'Escolha o Plano Ideal'}
            </h1>
            <p className="text-xl text-gray-600">
              {user?.planType === 'trial' && !userTrialExpired
                ? `Você ainda tem ${trialDaysLeft} dias de teste.`
                : 'Abandone as planilhas e tenha controle total das suas finanças.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {plans.filter(plan => plan.active).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={user?.planType === plan.id}
                onSelectPlan={handleSelectPlan}
                showSelectButton={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
