import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePlans } from '@/contexts/PlansContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, CreditCard, Pause, Play, Ban, Mail, User as UserIcon } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  plan_type: string;
  is_active: boolean;
  total_paid: number;
  monthly_revenue: number;
  last_payment_date: string | null;
  trial_end_date: string | null;
}

interface SubscriptionActionsModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const SubscriptionActionsModal: React.FC<SubscriptionActionsModalProps> = ({ user, isOpen, onClose, onRefresh }) => {
  const { toast } = useToast();
  const { plans } = usePlans();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState('');

  if (!user) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ is_active: !user.is_active })
        .eq('user_id', user.id);
      if (error) throw error;
      toast({ title: 'Sucesso', description: `Assinatura ${user.is_active ? 'pausada' : 'reativada'}.` });
      onRefresh?.();
      onClose();
    } catch {
      toast({ title: 'Erro', description: 'Falha ao alterar status.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedNewPlan) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ plan_type: selectedNewPlan as any })
        .eq('user_id', user.id);
      if (error) throw error;
      toast({ title: 'Plano alterado', description: 'Plano atualizado com sucesso.' });
      onRefresh?.();
      onClose();
    } catch {
      toast({ title: 'Erro', description: 'Falha ao alterar plano.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />Gestão - {user.name}
          </DialogTitle>
          <DialogDescription>Gerencie a assinatura deste usuário</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user.email}</p></div>
            <div><p className="text-sm text-gray-500">Status</p>
              <Badge variant={user.is_active ? "default" : "destructive"}>{user.is_active ? 'Ativo' : 'Inativo'}</Badge>
            </div>
            <div><p className="text-sm text-gray-500">Total Pago</p><p className="font-bold text-green-600">{formatCurrency(user.total_paid)}</p></div>
            <div><p className="text-sm text-gray-500">Receita Mensal</p><p className="font-bold text-blue-600">{formatCurrency(user.monthly_revenue)}</p></div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Alterar Plano</h3>
            <div className="flex gap-3">
              <Select value={selectedNewPlan} onValueChange={setSelectedNewPlan}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
                <SelectContent>
                  {plans.filter(p => p.active && p.id !== user.plan_type).map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleChangePlan} disabled={isLoading || !selectedNewPlan}>
                <CreditCard className="h-4 w-4 mr-2" />Alterar
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleToggleStatus} disabled={isLoading}>
              {user.is_active ? <><Pause className="h-4 w-4 mr-2" />Pausar</> : <><Play className="h-4 w-4 mr-2" />Reativar</>}
            </Button>
            <Button variant="outline" onClick={() => window.open(`mailto:${user.email}`, '_blank')}>
              <Mail className="h-4 w-4 mr-2" />Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionActionsModal;
