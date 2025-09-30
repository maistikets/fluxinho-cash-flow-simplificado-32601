import React, { useState } from 'react';
import { MonthlyGoal } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, TrendingUp, TrendingDown, PiggyBank, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface GoalSettingsProps {
  currentGoal: MonthlyGoal | null;
  onSaveGoal: (goal: Omit<MonthlyGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<MonthlyGoal>) => void;
}

const GoalSettings: React.FC<GoalSettingsProps> = ({ currentGoal, onSaveGoal, onUpdateGoal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    month: currentGoal?.month || format(new Date(), 'yyyy-MM'),
    incomeGoal: currentGoal?.incomeGoal.toString() || '',
    expenseLimit: currentGoal?.expenseLimit.toString() || '',
    savingsGoal: currentGoal?.savingsGoal.toString() || '',
    description: currentGoal?.description || ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.incomeGoal || !formData.expenseLimit || !formData.savingsGoal) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const goalData = {
      month: formData.month,
      incomeGoal: parseFloat(formData.incomeGoal),
      expenseLimit: parseFloat(formData.expenseLimit),
      savingsGoal: parseFloat(formData.savingsGoal),
      description: formData.description
    };

    if (currentGoal) {
      onUpdateGoal(currentGoal.id, goalData);
      toast({
        title: "Meta atualizada!",
        description: "Suas metas mensais foram atualizadas com sucesso."
      });
    } else {
      onSaveGoal(goalData);
      toast({
        title: "Meta criada!",
        description: "Suas metas mensais foram definidas com sucesso."
      });
    }

    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          {currentGoal ? 'Editar Meta' : 'Definir Meta'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            {currentGoal ? 'Editar Meta Mensal' : 'Definir Meta Mensal'}
          </DialogTitle>
          <DialogDescription>
            Configure suas metas financeiras para o mês e acompanhe seu progresso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="month">Mês de Referência</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Meta de Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="incomeGoal">Valor desejado (R$)</Label>
                  <Input
                    id="incomeGoal"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.incomeGoal}
                    onChange={(e) => handleInputChange('incomeGoal', e.target.value)}
                    placeholder="10.000,00"
                    className="h-11"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Limite de Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="expenseLimit">Valor limite (R$)</Label>
                  <Input
                    id="expenseLimit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.expenseLimit}
                    onChange={(e) => handleInputChange('expenseLimit', e.target.value)}
                    placeholder="7.000,00"
                    className="h-11"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-blue-600" />
                  Meta de Economia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="savingsGoal">Valor a economizar (R$)</Label>
                  <Input
                    id="savingsGoal"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.savingsGoal}
                    onChange={(e) => handleInputChange('savingsGoal', e.target.value)}
                    placeholder="3.000,00"
                    className="h-11"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva suas metas ou objetivos para este mês..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              {currentGoal ? 'Atualizar Meta' : 'Definir Meta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalSettings;