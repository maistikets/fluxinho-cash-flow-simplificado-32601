
import React, { useState } from 'react';
import MetricCard from '@/components/MetricCard';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import TransactionFilters from '@/components/TransactionFilters';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';
import { Plus } from 'lucide-react';

const Index = () => {
  const { transactions, categories, summary, markTransactionAsPaid, addTransaction } = useFinancialData();
  const { filters, setFilters, filteredTransactions } = useMonthlyFilters(transactions);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Welcome Section with Action Buttons */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Financeiro 📊
          </h2>
          <p className="text-gray-600">
            Visão geral das suas finanças em tempo real.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsIncomeFormOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Receita</span>
          </button>
          <button 
            onClick={() => setIsExpenseFormOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Saldo Atual"
          value={summary.currentBalance}
          color={summary.currentBalance >= 0 ? 'green' : 'red'}
          trend={summary.currentBalance >= 0 ? 'up' : 'down'}
          subtitle="Receitas - Despesas pagas"
        />
        <MetricCard
          title="Projeção 30 dias"
          value={summary.projectedBalance}
          color={summary.projectedBalance >= 0 ? 'blue' : 'yellow'}
          subtitle="Incluindo contas pendentes"
        />
        <MetricCard
          title="A Receber"
          value={summary.pendingIncome}
          color="green"
          subtitle="Valores pendentes"
        />
        <MetricCard
          title="A Pagar"
          value={summary.pendingExpenses}
          color="red"
          subtitle={`${summary.overdueCount} vencidas`}
        />
      </div>

      {/* Pending Transactions Grid - Moved up for better visibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <TransactionList
          transactions={filteredTransactions.filter(t => t.type === 'income' && t.status === 'pending')}
          title="Contas a Receber"
          type="income"
          onPaymentComplete={markTransactionAsPaid}
          showPaymentActions={true}
        />
        <TransactionList
          transactions={filteredTransactions.filter(t => t.type === 'expense' && (t.status === 'pending' || t.status === 'overdue'))}
          title="Contas a Pagar"
          type="expense"
          onPaymentComplete={markTransactionAsPaid}
          showPaymentActions={true}
        />
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <TransactionList
          transactions={filteredTransactions}
          title="Últimas Transações"
          type="all"
          limit={5}
        />
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Mês</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              R$ {summary.totalIncome.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">Total de Receitas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              R$ {summary.totalExpenses.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">Total de Despesas</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${summary.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {summary.currentBalance.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">Resultado Líquido</p>
          </div>
        </div>
      </div>

      {/* Transaction Forms */}
      <TransactionForm
        isOpen={isIncomeFormOpen}
        onClose={() => setIsIncomeFormOpen(false)}
        onAddTransaction={addTransaction}
        categories={categories}
        type="income"
      />
      
      <TransactionForm
        isOpen={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        onAddTransaction={addTransaction}
        categories={categories}
        type="expense"
      />
    </div>
  );
};

export default Index;
