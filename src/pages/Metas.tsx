import React, { useState } from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';
import { useGoals } from '@/hooks/useGoals';
import TransactionFilters from '@/components/TransactionFilters';
import GoalSettings from '@/components/GoalSettings';
import GoalProgressDisplay from '@/components/GoalProgressDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, Plus, TrendingUp, History } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const GoalsPage = () => {
  const { transactions } = useFinancialData();
  const { filters, setFilters, filteredTransactions } = useMonthlyFilters(transactions);
  const { goals, currentMonthGoal, currentProgress, addGoal, updateGoal, deleteGoal, calculateProgress } = useGoals(filteredTransactions);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Metas Financeiras 🎯</h1>
          <p className="text-gray-600">
            Configure e acompanhe suas metas mensais de receitas, despesas e economia
          </p>
        </div>
        <GoalSettings
          currentGoal={null}
          onSaveGoal={addGoal}
          onUpdateGoal={updateGoal}
        />
      </div>

      {/* Filtros */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Meta Atual */}
      {currentMonthGoal && currentProgress && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Meta do Mês Atual</h2>
            <Badge variant="outline">
              {format(parseISO(currentMonthGoal.month + '-01'), 'MMMM yyyy', { locale: ptBR })}
            </Badge>
          </div>
          <GoalProgressDisplay goal={currentMonthGoal} progress={currentProgress} />
        </div>
      )}

      {/* Histórico de Metas */}
      {goals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Histórico de Metas</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal);
              const isCurrentMonth = goal.id === currentMonthGoal?.id;
              
              return (
                <Card 
                  key={goal.id} 
                  className={`${isCurrentMonth ? 'border-purple-200 bg-purple-50' : ''} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {format(parseISO(goal.month + '-01'), 'MMMM yyyy', { locale: ptBR })}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {isCurrentMonth && (
                          <Badge variant="default">Atual</Badge>
                        )}
                        <Badge 
                          variant={progress.isOnTrack ? "default" : "destructive"}
                        >
                          {progress.isOnTrack ? 'Sucesso' : 'Atenção'}
                        </Badge>
                      </div>
                    </div>
                    {goal.description && (
                      <CardDescription>{goal.description}</CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{progress.incomeProgress}%</div>
                        <div className="text-gray-500">Receitas</div>
                        <div className="text-xs text-gray-400">
                          {formatCurrency(progress.currentIncome)} / {formatCurrency(goal.incomeGoal)}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold text-red-600">{progress.expenseProgress}%</div>
                        <div className="text-gray-500">Despesas</div>
                        <div className="text-xs text-gray-400">
                          {formatCurrency(progress.currentExpenses)} / {formatCurrency(goal.expenseLimit)}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{progress.savingsProgress}%</div>
                        <div className="text-gray-500">Economia</div>
                        <div className="text-xs text-gray-400">
                          {formatCurrency(progress.currentSavings)} / {formatCurrency(goal.savingsGoal)}
                        </div>
                      </div>
                    </div>

                    {selectedGoal === goal.id && (
                      <div className="mt-4 pt-4 border-t">
                        <GoalProgressDisplay goal={goal} progress={progress} />
                        <div className="flex justify-end gap-2 mt-4">
                          <GoalSettings
                            currentGoal={goal}
                            onSaveGoal={addGoal}
                            onUpdateGoal={updateGoal}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGoal(goal.id);
                            }}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {goals.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma meta definida</h3>
            <p className="text-gray-500 mb-6">
              Comece definindo sua primeira meta mensal para acompanhar seu progresso financeiro
            </p>
            <GoalSettings
              currentGoal={null}
              onSaveGoal={addGoal}
              onUpdateGoal={updateGoal}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalsPage;