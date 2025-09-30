import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlans } from '@/contexts/PlansContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';
import { getTrialDaysLeft, isTrialExpired } from '@/utils/trialHelpers';
import { useToast } from '@/hooks/use-toast';
import PlanHeader from '@/components/PlanHeader';
import TrialExpiredBanner from '@/components/TrialExpiredBanner';
import SystemPurposeBanner from '@/components/SystemPurposeBanner';
import PlanCard from '@/components/PlanCard';

const PlanSelection = () => {
  const { user, changeUserPlan } = useAuth();
  const { plans } = usePlans();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectPlan = (planId: string) => {
    console.log('Selecionando plano:', planId);
    
    // Se for trial, ativar imediatamente
    if (planId === 'trial') {
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para ativar o teste grátis",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      changeUserPlan(user.id, planId as any);
      toast({
        title: "Teste ativado!",
        description: "Seu período de teste foi ativado com sucesso"
      });
      navigate('/dashboard');
      return;
    }

    // Para planos pagos, verificar login
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para continuar com a assinatura",
        variant: "destructive"
      });
      localStorage.setItem('selectedPlan', planId);
      navigate('/login');
      return;
    }

    // Para planos pagos (não trial), sempre redirecionar para checkout
    navigate('/checkout', { state: { planId } });
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'basic': return <Zap className="h-6 w-6" />;
      case 'premium': 
      case 'annual': return <Crown className="h-6 w-6" />;
      default: return <Check className="h-6 w-6" />;
    }
  };

  const getPlanButtonText = (planId: string) => {
    if (!user) return planId === 'trial' ? 'Começar Teste Grátis' : 'Assinar Plano';
    
    if (user.planType === planId && planId === 'trial') {
      return 'Plano Atual';
    }
    
    return planId === 'trial' ? 'Ativar Teste Grátis' : 'Assinar Plano';
  };

  const isCurrentPlan = (planId: string) => {
    return user?.planType === planId;
  };

  const trialDaysLeft = user ? getTrialDaysLeft(user) : 0;
  const userTrialExpired = user ? isTrialExpired(user) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <PlanHeader showBackButton={!!user} backPath="/dashboard" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Trial Expired Banner - Positioned ABOVE everything when trial is expired */}
          {user && userTrialExpired && <TrialExpiredBanner />}
          
          {/* System Purpose Banner - Show for new users or when trial is active */}
          {(!user || (user.planType === 'trial' && !userTrialExpired)) && <SystemPurposeBanner />}
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {userTrialExpired 
                ? 'Continue sua Jornada - Escolha seu Plano'
                : 'Escolha o Plano Ideal'
              }
            </h1>
            <p className="text-xl text-gray-600">
              {user?.planType === 'trial' && !userTrialExpired
                ? `Você ainda tem ${trialDaysLeft} dias de teste. Aproveite para conhecer todas as funcionalidades!`
                : userTrialExpired
                ? 'Você já experimentou como é fácil controlar finanças sem planilhas. Agora escolha o melhor plano para continuar!'
                : 'Abandone as planilhas e tenha controle total das suas finanças com inteligência e eficiência.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {plans.filter(plan => plan.active).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={isCurrentPlan(plan.id)}
                onSelectPlan={handleSelectPlan}
                showSelectButton={true}
              />
            ))}
          </div>

          {user?.planType === 'trial' && !userTrialExpired && (
            <div className="mt-12 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  🎯 Período de Teste Ativo
                </h3>
                <p className="text-blue-700">
                  Você ainda tem <strong>{trialDaysLeft} dias</strong> para explorar todas as funcionalidades. 
                  Quando estiver pronto, escolha um plano para garantir acesso contínuo ao sistema.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
