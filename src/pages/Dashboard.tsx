import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  FileText,
  Target,
  Calendar,
  Bell,
  AlertTriangle
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import TransactionFilters from '@/components/TransactionFilters';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';
import { useGoals } from '@/hooks/useGoals';

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, summary } = useFinancialData();
  
  // Add fallback to avoid undefined errors
  const monthlyFiltersResult = useMonthlyFilters(transactions);
  const { filters, setFilters, filteredTransactions = transactions } = monthlyFiltersResult || { filters: null, setFilters: () => {}, filteredTransactions: transactions };
  
  const { currentMonthGoal, currentProgress } = useGoals(filteredTransactions);

  // Calculando métricas com dados filtrados
  const metrics = {
    totalReceitas: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    
    totalDespesas: filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    
    saldoDisponivel: summary.currentBalance,
    
    percentualMeta: currentProgress?.incomeProgress || 0
  };

  // Usar transações filtradas em vez de dados estáticos
  const recentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 4)
    .map(t => ({
      id: t.id,
      type: t.type === 'income' ? 'receita' : 'despesa',
      description: t.description,
      amount: t.type === 'income' ? t.amount : -t.amount,
      date: t.dueDate
    }));

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'receita':
        navigate('/receitas');
        break;
      case 'despesa':
        navigate('/despesas');
        break;
      case 'relatorios':
        navigate('/relatorios');
        break;
      case 'metas':
        navigate('/metas');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 w-full">
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 line-clamp-2">Dashboard Financeiro 📊</h1>
          <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
            Visão geral das suas finanças em tempo real.
          </p>
        </div>
      </div>

      {/* Filtros */}
      {filters && (
        <div className="mb-4 lg:mb-6">
          <TransactionFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      )}

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Total de Receitas"
          value={metrics.totalReceitas}
          color="green"
          subtitle="Período selecionado"
        />
        <MetricCard
          title="Total de Despesas"
          value={metrics.totalDespesas}
          color="red"
          subtitle="Período selecionado"
        />
        <MetricCard
          title="Saldo Atual"
          value={summary.currentBalance}
          color={summary.currentBalance >= 0 ? 'blue' : 'red'}
          subtitle="Disponível para uso"
        />
        <MetricCard
          title="Meta Mensal"
          value={metrics.percentualMeta}
          color="blue"
          subtitle={`${metrics.percentualMeta}% atingido`}
          formatAsCurrency={false}
        />
      </div>

      {/* Grid com informações detalhadas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Transações Recentes
            </CardTitle>
            <CardDescription>
              Últimas movimentações do período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="font-medium text-gray-900 line-clamp-1 text-sm sm:text-base">{transaction.description}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                    <div className={`font-bold text-right flex-shrink-0 text-sm sm:text-base ${
                      transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6 text-sm sm:text-base">Nenhuma transação encontrada no período selecionado</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resumo do Período
            </CardTitle>
            <CardDescription>
              Visão geral das finanças no período filtrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            <div className="flex justify-between items-center py-2 px-3 sm:px-0">
               <span className="text-gray-600 text-sm sm:text-base">Total de Receitas</span>
               <span className="font-bold text-green-600 text-sm sm:text-base">
                 R$ {metrics.totalReceitas.toLocaleString('pt-BR')}
               </span>
             </div>
             <div className="flex justify-between items-center py-2 px-3 sm:px-0">
               <span className="text-gray-600 text-sm sm:text-base">Total de Despesas</span>
               <span className="font-bold text-red-600 text-sm sm:text-base">
                 R$ {metrics.totalDespesas.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center py-2 px-3 sm:px-0">
                <span className="text-gray-900 font-medium text-sm sm:text-base">Resultado Líquido</span>
                <span className={`font-bold text-lg sm:text-xl ${
                  (metrics.totalReceitas - metrics.totalDespesas) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  R$ {(metrics.totalReceitas - metrics.totalDespesas).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

              {/* Barra de progresso da meta */}
              {currentMonthGoal && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso da Meta</span>
                    <span>{metrics.percentualMeta}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(metrics.percentualMeta, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de ação rápida */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleQuickAction('receita')}
        >
          <CardHeader className="text-center p-4 lg:p-6">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-base sm:text-lg line-clamp-1">Nova Receita</CardTitle>
            <CardDescription className="text-sm line-clamp-2">Registrar entrada de dinheiro</CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleQuickAction('despesa')}
        >
          <CardHeader className="text-center p-4 lg:p-6">
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-2" />
            <CardTitle className="text-base sm:text-lg line-clamp-1">Nova Despesa</CardTitle>
            <CardDescription className="text-sm line-clamp-2">Registrar saída de dinheiro</CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleQuickAction('relatorios')}
        >
          <CardHeader className="text-center p-4 lg:p-6">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-base sm:text-lg line-clamp-1">Relatórios</CardTitle>
            <CardDescription className="text-sm line-clamp-2">Ver análises detalhadas</CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleQuickAction('metas')}
        >
          <CardHeader className="text-center p-4 lg:p-6">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-base sm:text-lg line-clamp-1">Metas</CardTitle>
            <CardDescription className="text-sm line-clamp-2">Definir e acompanhar metas</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;