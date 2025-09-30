
import React from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMonthlyFilters } from '@/hooks/useMonthlyFilters';
import TransactionTable from '@/components/TransactionTable';
import TransactionFilters from '@/components/TransactionFilters';
import MetricCard from '@/components/MetricCard';
import NotificationCenter from '@/components/NotificationCenter';
import { Plus, Bell, Settings } from 'lucide-react';
import { useState } from 'react';
import TransactionForm from '@/components/TransactionForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Receitas = () => {
  const { transactions, categories, markTransactionAsPaid, addTransaction, updateTransaction, deleteTransaction, notifications } = useFinancialData();
  const { filters, setFilters, filteredTransactions } = useMonthlyFilters(transactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
  const pendingCount = incomeTransactions.filter(t => t.status !== 'paid').length;
  const totalValue = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const recurringCount = incomeTransactions.filter(t => t.isRecurring).length;
  
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Receitas 💰</h1>
          <p className="text-gray-600">
            Gerencie suas receitas e valores a receber
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button
            variant="outline"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative order-2 sm:order-1"
          >
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notificações</span>
            <span className="sm:hidden">Alertas</span>
            {notifications.unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notifications.unreadCount}
              </Badge>
            )}
          </Button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-md order-1 sm:order-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Receita</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
        <MetricCard
          title="Total de Receitas"
          value={incomeTransactions.length}
          color="blue"
          subtitle={`${incomeTransactions.length === 1 ? 'receita cadastrada' : 'receitas cadastradas'}`}
          formatAsCurrency={false}
        />
        <MetricCard
          title="Receitas Pendentes"
          value={pendingCount}
          color={pendingCount > 0 ? 'yellow' : 'green'}
          subtitle="Aguardando recebimento"
          formatAsCurrency={false}
        />
        <MetricCard
          title="Receitas Recorrentes"
          value={recurringCount}
          color="blue"
          subtitle={`${recurringCount === 1 ? 'receita recorrente' : 'receitas recorrentes'}`}
          formatAsCurrency={false}
        />
        <MetricCard
          title="Valor Total"
          value={totalValue}
          color="green"
          subtitle="Soma de todas as receitas"
        />
      </div>

      {/* Central de Notificações */}
      {showNotifications && (
        <NotificationCenter
          alerts={notifications.alerts}
          unreadCount={notifications.unreadCount}
          onMarkAsRead={notifications.markAsRead}
          onClearAlert={notifications.clearAlert}
        />
      )}

      {/* Tabela de transações */}
      <TransactionTable
        transactions={incomeTransactions}
        type="income"
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
        type="income"
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default Receitas;
