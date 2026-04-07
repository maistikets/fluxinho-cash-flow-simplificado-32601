import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, TrendingUp, TrendingDown, BarChart3, Target, CreditCard, Lock, Unlock
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import TransactionFilters from '@/components/TransactionFilters';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';
import { useGoals } from '@/hooks/useGoals';
import { useCreditCards } from '@/hooks/useCreditCards';
import { getInvoiceStatus } from '@/components/CreditCardDetail';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, summary } = useFinancialData();
  const { cards, getCardUsed } = useCreditCards();
  
  const monthlyFiltersResult = useMonthlyFilters(transactions);
  const { filters, setFilters, filteredTransactions = transactions } = monthlyFiltersResult || { filters: null, setFilters: () => {}, filteredTransactions: transactions };
  
  const { currentMonthGoal, currentProgress } = useGoals(filteredTransactions);

  const metrics = {
    totalReceitas: filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalDespesas: filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    saldoDisponivel: summary.currentBalance,
    percentualMeta: currentProgress?.incomeProgress || 0
  };

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

  // Credit card invoice summary
  const totalInvoices = cards.reduce((sum, card) => sum + getCardUsed(card.id), 0);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'receita': navigate('/receitas'); break;
      case 'despesa': navigate('/despesas'); break;
      case 'relatorios': navigate('/relatorios'); break;
      case 'metas': navigate('/metas'); break;
      case 'cartoes': navigate('/cartoes'); break;
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 w-full">
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 line-clamp-2">Dashboard Financeiro 📊</h1>
          <p className="text-sm sm:text-base text-gray-600 line-clamp-2">Visão geral das suas finanças em tempo real.</p>
        </div>
      </div>

      {filters && (
        <div className="mb-4 lg:mb-6">
          <TransactionFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      )}

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard title="Total de Receitas" value={metrics.totalReceitas} color="green" subtitle="Período selecionado" />
        <MetricCard title="Total de Despesas" value={metrics.totalDespesas} color="red" subtitle="Período selecionado" />
        <MetricCard title="Saldo Atual" value={summary.currentBalance} color={summary.currentBalance >= 0 ? 'blue' : 'red'} subtitle="Disponível para uso" />
        <MetricCard title="Meta Mensal" value={metrics.percentualMeta} color="blue" subtitle={`${metrics.percentualMeta}% atingido`} formatAsCurrency={false} />
      </div>

      {/* Resumo de Faturas + Transações Recentes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Faturas de Cartão */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-500" />
              Faturas de Cartão
            </CardTitle>
            <CardDescription>Resumo das faturas do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            {cards.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">Nenhum cartão cadastrado</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/cartoes')}>Cadastrar Cartão</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {cards.map(card => {
                  const used = getCardUsed(card.id);
                  const status = getInvoiceStatus(card);
                  return (
                    <div key={card.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate('/cartoes')}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: card.color || '#6366f1' }} />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{card.name}</p>
                          <div className="flex items-center gap-1">
                            {status.isClosed ? <Lock className="h-3 w-3 text-red-500" /> : <Unlock className="h-3 w-3 text-green-500" />}
                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-destructive whitespace-nowrap">R$ {used.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="pt-2 border-t flex justify-between items-center">
                  <span className="font-medium text-sm">Total em Faturas</span>
                  <span className="font-bold text-destructive">R$ {totalInvoices.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Transações Recentes</CardTitle>
            <CardDescription>Últimas movimentações do período selecionado</CardDescription>
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
                    <div className={`font-bold text-right flex-shrink-0 text-sm sm:text-base ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
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
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Resumo do Período</CardTitle>
          <CardDescription>Visão geral das finanças no período filtrado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50">
              <p className="text-sm text-gray-600">Receitas</p>
              <p className="text-lg font-bold text-green-600">R$ {metrics.totalReceitas.toLocaleString('pt-BR')}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50">
              <p className="text-sm text-gray-600">Despesas</p>
              <p className="text-lg font-bold text-red-600">R$ {metrics.totalDespesas.toLocaleString('pt-BR')}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <p className="text-sm text-gray-600">Resultado Líquido</p>
              <p className={`text-lg font-bold ${(metrics.totalReceitas - metrics.totalDespesas) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {(metrics.totalReceitas - metrics.totalDespesas).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          {currentMonthGoal && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso da Meta</span>
                <span>{metrics.percentualMeta}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(metrics.percentualMeta, 100)}%` }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards de ação rápida */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { action: 'receita', icon: TrendingUp, color: 'text-green-600', title: 'Nova Receita', desc: 'Registrar entrada' },
          { action: 'despesa', icon: TrendingDown, color: 'text-red-600', title: 'Nova Despesa', desc: 'Registrar saída' },
          { action: 'relatorios', icon: BarChart3, color: 'text-blue-600', title: 'Relatórios', desc: 'Ver análises' },
          { action: 'metas', icon: Target, color: 'text-purple-600', title: 'Metas', desc: 'Acompanhar metas' },
          { action: 'cartoes', icon: CreditCard, color: 'text-indigo-600', title: 'Cartões', desc: 'Ver faturas' },
        ].map(item => (
          <Card key={item.action} className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]" onClick={() => handleQuickAction(item.action)}>
            <CardHeader className="text-center p-4">
              <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-1`} />
              <CardTitle className="text-sm">{item.title}</CardTitle>
              <CardDescription className="text-xs">{item.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
