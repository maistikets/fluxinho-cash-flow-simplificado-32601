
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usePlans } from '@/contexts/PlansContext';
import PlanCard from '@/components/PlanCard';
import CurrentPlanCard from '@/components/CurrentPlanCard';
import PlanStatusSection from '@/components/PlanStatusSection';
import PlanHistorySection from '@/components/PlanHistorySection';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const PlanSettings = () => {
  const { user, checkTrialStatus } = useAuth();
  const { plans } = usePlans();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    checkTrialStatus();
  }, [checkTrialStatus]);

  const handleSelectPlan = (planId: string) => {
    if (planId === user?.planType) return;
    
    if (planId === 'trial') {
      toast({
        title: "Teste não disponível",
        description: "Você já utilizou o período de teste gratuito.",
        variant: "destructive"
      });
      return;
    }

    navigate('/checkout', { state: { planId } });
  };

  return (
    <div className="space-y-6">
      <CurrentPlanCard />
      
      <div className="space-y-4">
        <PlanStatusSection />
      </div>

      {/* Planos Disponíveis com PlanCard */}
      <Card>
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <CardDescription>Escolha o plano ideal para suas necessidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.filter(p => p.active).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={user?.planType === plan.id}
                onSelectPlan={handleSelectPlan}
                showSelectButton={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <PlanHistorySection />
    </div>
  );
};

export default PlanSettings;
