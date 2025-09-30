
import React from 'react';
import CashFlowChart from '@/components/CashFlowChart';
import MetricCard from '@/components/MetricCard';
import TransactionTable from '@/components/TransactionTable';
import TransactionFilters from '@/components/TransactionFilters';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';

const FluxoCaixa = () => {
  const { summary, transactions, markTransactionAsPaid } = useFinancialData();
  const { filters, setFilters, filteredTransactions } = useMonthlyFilters(transactions);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fluxo de Caixa</h1>
        <p className="text-gray-600">Visualize o movimento financeiro da sua empresa</p>
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

      {/* All Transactions Table */}
      <div className="mb-8">
        <TransactionTable
          transactions={filteredTransactions}
          type="all"
          onPaymentComplete={markTransactionAsPaid}
          showPaymentActions={true}
          hideTotal={true}
        />
      </div>

      {/* Chart - Reduced size */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-64">
          <CashFlowChart />
        </div>
      </div>
    </div>
  );
};

export default FluxoCaixa;
