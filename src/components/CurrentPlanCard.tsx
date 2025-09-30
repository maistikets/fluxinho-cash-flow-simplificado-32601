
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Crown, X } from 'lucide-react';
import { usePlans } from '@/contexts/PlansContext';
import { isTrialExpired } from '@/utils/trialHelpers';
import { useNavigate } from 'react-router-dom';

const CurrentPlanCard = () => {
  const { user } = useAuth();
  const { plans } = usePlans();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

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

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    setTimeout(() => {
      toast({
        title: "Cancelamento processado",
        description: "Sua assinatura será cancelada ao final do período atual.",
        variant: "destructive",
      });
      setIsCanceling(false);
    }, 1000);
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

  const getCurrentPlan = () => {
    if (user?.planType === 'trial') {
      return plans.find(p => p.name.toLowerCase().includes('gratuito') || p.name.toLowerCase().includes('trial'));
    }
    if (user?.planType === 'premium') {
      return plans.find(p => p.name.toLowerCase().includes('trimestral'));
    }
    if (user?.planType === 'basic') {
      return plans.find(p => p.name.toLowerCase().includes('mensal'));
    }
    if (user?.planType === 'annual') {
      return plans.find(p => p.name.toLowerCase().includes('anual'));
    }
    return plans[0];
  };

  const currentPlan = getCurrentPlan();
  const nextRenewalDate = getNextRenewalDate();
  const userTrialExpired = user ? isTrialExpired(user) : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-yellow-500" />
            <div>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>Gerencie seu plano e assinatura</CardDescription>
            </div>
          </div>
          <Badge variant={getPlanBadgeColor()}>
            {currentPlan?.name || getPlanName()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="pt-4 border-t space-y-3">
          {(user?.planType === 'basic' || userTrialExpired) && (
            <Button 
              onClick={() => navigate('/plans')} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "Processando..." : "Fazer Upgrade"}
            </Button>
          )}

          {(user?.planType === 'premium' || user?.planType === 'basic') && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={isCanceling}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar Assinatura
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar Assinatura</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar sua assinatura? Você continuará tendo acesso aos recursos premium até {nextRenewalDate}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Manter Assinatura</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCancelSubscription}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isCanceling}
                  >
                    {isCanceling ? "Processando..." : "Confirmar Cancelamento"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlanCard;
