
import React from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';
import TransactionTable from '@/components/TransactionTable';
import TransactionFilters from '@/components/TransactionFilters';
import MetricCard from '@/components/MetricCard';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TransactionForm from '@/components/TransactionForm';

const Despesas = () => {
  const { transactions, categories, markTransactionAsPaid, addTransaction, updateTransaction, deleteTransaction } = useFinancialData();
  const { filters, setFilters, filteredTransactions } = useMonthlyFilters(transactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
  const pendingCount = expenseTransactions.filter(t => t.status !== 'paid').length;
  const totalValue = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Despesas 💸</h1>
          <p className="text-gray-600">
            Gerencie suas despesas e contas a pagar
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-md"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        <MetricCard
          title="Total de Despesas"
          value={expenseTransactions.length}
          color="blue"
          subtitle={`${expenseTransactions.length === 1 ? 'despesa cadastrada' : 'despesas cadastradas'}`}
          formatAsCurrency={false}
        />
        <MetricCard
          title="Despesas Pendentes"
          value={pendingCount}
          color={pendingCount > 0 ? 'red' : 'green'}
          subtitle="Aguardando pagamento"
          formatAsCurrency={false}
        />
        <MetricCard
          title="Valor Total"
          value={totalValue}
          color="red"
          subtitle="Soma de todas as despesas"
        />
      </div>

      {/* Tabela de transações */}
      <TransactionTable
        transactions={expenseTransactions}
        type="expense"
        onPaymentComplete={markTransactionAsPaid}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        showPaymentActions={true}
        showEditActions={true}
        hideTotal={true}
      />

      {/* Modal de formulário */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onAddTransaction={addTransaction}
        onUpdateTransaction={updateTransaction}
        categories={categories}
        type="expense"
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default Despesas;
