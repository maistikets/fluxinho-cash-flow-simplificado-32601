
import React from 'react';
import ModernReportGenerator from '@/components/ModernReportGenerator';
import TransactionFilters from '@/components/TransactionFilters';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';
import MetricCard from '@/components/MetricCard';

const Relatorios = () => {
  const { transactions } = useFinancialData();
  const { filters, setFilters, filteredTransactions } = useMonthlyFilters(transactions);

  // Calculando métricas com dados filtrados
  const totalTransactions = filteredTransactions.length;
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios Financeiros 📊</h1>
          <p className="text-gray-600">
            Gere relatórios detalhados e personalizados do seu fluxo financeiro
          </p>
        </div>
      </div>

      {/* Filtros */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total de Transações"
          value={totalTransactions}
          color="blue"
          subtitle={`${totalTransactions === 1 ? 'transação registrada' : 'transações registradas'}`}
          formatAsCurrency={false}
        />
        <MetricCard
          title="Total de Receitas"
          value={totalIncome}
          color="green"
          subtitle="Valores a receber"
        />
        <MetricCard
          title="Total de Despesas"
          value={totalExpenses}
          color="red"
          subtitle="Valores a pagar"
        />
        <MetricCard
          title={balance >= 0 ? "Saldo Positivo" : "Déficit"}
          value={Math.abs(balance)}
          color={balance >= 0 ? "blue" : "yellow"}
          subtitle={balance >= 0 ? "Resultado positivo" : "Resultado negativo"}
        />
      </div>

      {/* Gerador de Relatórios */}
      <ModernReportGenerator transactions={filteredTransactions} />
    </div>
  );
};

export default Relatorios;
