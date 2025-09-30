import React from 'react';
import { MonthlyGoal, GoalProgress } from '@/types/goals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, PiggyBank, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalProgressDisplayProps {
  goal: MonthlyGoal;
  progress: GoalProgress;
}

const GoalProgressDisplay: React.FC<GoalProgressDisplayProps> = ({ goal, progress }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getProgressColor = (percentage: number, isExpense: boolean = false) => {
    if (isExpense) {
      // Para despesas, menos é melhor
      if (percentage <= 70) return 'text-green-600';
      if (percentage <= 90) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      // Para receitas e economia, mais é melhor
      if (percentage >= 100) return 'text-green-600';
      if (percentage >= 80) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getProgressBg = (percentage: number, isExpense: boolean = false) => {
    if (isExpense) {
      if (percentage <= 70) return 'bg-green-500';
      if (percentage <= 90) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (percentage >= 100) return 'bg-green-500';
      if (percentage >= 80) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Progresso das Metas</h3>
        </div>
        <Badge 
          variant={progress.isOnTrack ? "default" : "destructive"}
          className="gap-1"
        >
          {progress.isOnTrack ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <AlertTriangle className="h-3 w-3" />
          )}
          {progress.isOnTrack ? 'No Caminho Certo' : 'Atenção Necessária'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meta de Receita */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className={cn("font-semibold", getProgressColor(progress.incomeProgress))}>
                  {progress.incomeProgress}%
                </span>
              </div>
              <Progress 
                value={Math.min(progress.incomeProgress, 100)} 
                className="h-2"
              />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Atual:</span>
                <span className="font-medium">{formatCurrency(progress.currentIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meta:</span>
                <span className="font-medium">{formatCurrency(goal.incomeGoal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Restante:</span>
                <span className={cn(
                  "font-medium",
                  progress.currentIncome >= goal.incomeGoal ? "text-green-600" : "text-orange-600"
                )}>
                  {formatCurrency(Math.max(0, goal.incomeGoal - progress.currentIncome))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limite de Despesas */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Uso do Limite</span>
                <span className={cn("font-semibold", getProgressColor(progress.expenseProgress, true))}>
                  {progress.expenseProgress}%
                </span>
              </div>
              <Progress 
                value={Math.min(progress.expenseProgress, 100)} 
                className="h-2"
              />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gasto:</span>
                <span className="font-medium">{formatCurrency(progress.currentExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Limite:</span>
                <span className="font-medium">{formatCurrency(goal.expenseLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disponível:</span>
                <span className={cn(
                  "font-medium",
                  progress.currentExpenses <= goal.expenseLimit ? "text-green-600" : "text-red-600"
                )}>
                  {formatCurrency(Math.max(0, goal.expenseLimit - progress.currentExpenses))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meta de Economia */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-blue-600" />
              Economia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className={cn("font-semibold", getProgressColor(progress.savingsProgress))}>
                  {progress.savingsProgress}%
                </span>
              </div>
              <Progress 
                value={Math.min(progress.savingsProgress, 100)} 
                className="h-2"
              />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Economizado:</span>
                <span className={cn(
                  "font-medium",
                  progress.currentSavings >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatCurrency(progress.currentSavings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meta:</span>
                <span className="font-medium">{formatCurrency(goal.savingsGoal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Restante:</span>
                <span className={cn(
                  "font-medium",
                  progress.currentSavings >= goal.savingsGoal ? "text-green-600" : "text-orange-600"
                )}>
                  {formatCurrency(Math.max(0, goal.savingsGoal - progress.currentSavings))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {goal.description && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-4">
            <p className="text-sm text-purple-700">
              <strong>Objetivo:</strong> {goal.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalProgressDisplay;