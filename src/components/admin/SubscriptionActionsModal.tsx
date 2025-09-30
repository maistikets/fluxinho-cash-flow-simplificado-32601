
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePlans } from '@/contexts/PlansContext';
import { User } from '@/types/auth';
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Pause, 
  Play, 
  Ban, 
  Mail,
  Phone,
  User as UserIcon,
  AlertTriangle
} from 'lucide-react';

interface SubscriptionActionsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionActionsModal: React.FC<SubscriptionActionsModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const { updateUser, changeUserPlan, toggleUserStatus } = useAuth();
  const { plans } = usePlans();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string>('');

  if (!user) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPlanBadge = (planType: string, isActive: boolean) => {
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

  const handlePauseSubscription = async () => {
    setIsLoading(true);
    try {
      const success = toggleUserStatus(user.id);
      if (success) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        const action = user.isActive ? 'pausada' : 'reativada';
        toast({
          title: `✅ Assinatura ${action}!`,
          description: `A assinatura de ${user.name} foi ${action} em ${currentDate}. Status e datas atualizados no sistema.`,
        });
        onClose();
      } else {
        throw new Error('Falha ao alterar status');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsLoading(true);
    try {
      const success = toggleUserStatus(user.id);
      if (success) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        const action = !user.isActive ? 'reativada' : 'pausada';
        toast({
          title: `✅ Assinatura ${action}!`,
          description: `A assinatura de ${user.name} foi ${action} em ${currentDate}. Cobrança retomada conforme o plano ativo.`,
        });
        onClose();
      } else {
        throw new Error('Falha ao alterar status');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const success = updateUser(user.id, { isActive: false, planType: 'trial' });
      if (success) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        toast({
          title: "Assinatura cancelada",
          description: `A assinatura de ${user.name} foi cancelada em ${currentDate} e convertida para plano trial. Todas as datas foram atualizadas.`,
          variant: "destructive",
        });
        onClose();
      } else {
        throw new Error('Falha ao cancelar assinatura');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedNewPlan) {
      toast({
        title: "Erro",
        description: "Selecione um plano primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = changeUserPlan(user.id, selectedNewPlan as any);
      if (success) {
        const selectedPlan = plans.find(p => p.id === selectedNewPlan);
        const currentDate = new Date().toLocaleDateString('pt-BR');
        
        toast({
          title: "✅ Plano alterado com sucesso!",
          description: `Plano de ${user.name} alterado para ${selectedPlan?.name} em ${currentDate}. Nova cobrança será processada conforme o ciclo do plano.`,
        });
        onClose();
      } else {
        throw new Error('Falha ao alterar plano');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o plano.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Gestão de Assinatura - {user.name}
          </DialogTitle>
          <DialogDescription>
            Gerencie a assinatura e pagamentos deste usuário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Usuário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Plano Atual</p>
              {getPlanBadge(user.planType, user.isActive)}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Informações Financeiras */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Total Pago</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(user.totalPaid || 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Receita Mensal</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(user.monthlyRevenue || 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Último Pagamento</p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                {user.lastPaymentDate 
                  ? new Date(user.lastPaymentDate).toLocaleDateString('pt-BR')
                  : 'Nunca'
                }
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Próximo Pagamento</p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                {user.nextPaymentDate 
                  ? new Date(user.nextPaymentDate).toLocaleDateString('pt-BR')
                  : 'N/A'
                }
              </p>
            </div>
          </div>

          <Separator />

          {/* Informações de Controle de Assinatura */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Controle de Assinatura
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data de Início</p>
                <p className="text-sm font-medium">
                  {user.subscriptionStartDate 
                    ? new Date(user.subscriptionStartDate).toLocaleDateString('pt-BR')
                    : user.trialStartDate 
                      ? new Date(user.trialStartDate).toLocaleDateString('pt-BR') + ' (Trial)'
                      : 'Não definida'
                  }
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Próxima Cobrança</p>
                <p className="text-sm font-medium">
                  {user.nextPaymentDate ? (
                    <span className="text-blue-600">
                      {new Date(user.nextPaymentDate).toLocaleDateString('pt-BR')}
                    </span>
                  ) : user.trialEndDate ? (
                    <span className="text-orange-600">
                      {new Date(user.trialEndDate).toLocaleDateString('pt-BR')} (Fim do Trial)
                    </span>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tempo de Assinatura</p>
                <p className="text-sm font-medium">
                  {user.subscriptionStartDate || user.trialStartDate ? (
                    (() => {
                      const startDate = new Date(user.subscriptionStartDate || user.trialStartDate || '');
                      const now = new Date();
                      const diffTime = Math.abs(now.getTime() - startDate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      if (diffDays < 30) return `${diffDays} dias`;
                      if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
                      return `${Math.floor(diffDays / 365)} anos`;
                    })()
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status da Cobrança</p>
                <div className="flex items-center gap-1">
                  {user.isActive ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      ✓ Ativa
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      ⏸ Pausada
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Alterar Plano */}
          <div>
            <h3 className="font-medium mb-3">Alterar Plano</h3>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Novo Plano</label>
                <Select value={selectedNewPlan} onValueChange={setSelectedNewPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.filter(p => p.active && p.id !== user.planType).map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.price} {plan.period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleChangePlan}
                disabled={isLoading || !selectedNewPlan}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Alterar Plano
              </Button>
            </div>
          </div>

          <Separator />

          {/* Ações Rápidas */}
          <div>
            <h3 className="font-medium mb-3">Ações da Assinatura</h3>
            <div className="grid grid-cols-2 gap-3">
              {user.isActive ? (
                <Button 
                  variant="outline" 
                  onClick={handlePauseSubscription}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Pausar Assinatura
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleReactivateSubscription}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Reativar Assinatura
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => window.open(`mailto:${user.email}?subject=Cobrança%20FinanceApp&body=Olá%20${user.name},%0A%0AEste%20é%20um%20lembrete%20sobre%20seu%20plano%20${user.planType}.`, '_blank')}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Enviar Email
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "Histórico de pagamentos será implementado em breve.",
                })}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Histórico Pagamentos
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Ban className="h-4 w-4" />
                Cancelar Assinatura
              </Button>
            </div>
          </div>

          {/* Alertas */}
          {user.isTrialExpired && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700 font-medium">
                  Teste gratuito expirado - Conversão necessária
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionActionsModal;
