import { useState, useMemo, useCallback } from 'react';
import { Transaction, Category } from '@/types/financial';
import { useNotifications } from '@/hooks/useNotifications';
import { useTransactions, Transaction as SupaTransaction } from '@/hooks/useTransactions';

const initialCategories: Category[] = [
  { id: '1', name: 'Vendas', type: 'income', color: '#10b981' },
  { id: '2', name: 'Serviços', type: 'income', color: '#3b82f6' },
  { id: '3', name: 'Consultoria', type: 'income', color: '#8b5cf6' },
  { id: '4', name: 'Freelances', type: 'income', color: '#f59e0b' },
  { id: '5', name: 'Comissões', type: 'income', color: '#06b6d4' },
  { id: '6', name: 'Royalties', type: 'income', color: '#84cc16' },
  { id: '7', name: 'Investimentos', type: 'income', color: '#6366f1' },
  { id: '8', name: 'Outros', type: 'income', color: '#64748b' },
  { id: '9', name: 'Aluguel', type: 'expense', color: '#ef4444' },
  { id: '10', name: 'Fornecedores', type: 'expense', color: '#f59e0b' },
  { id: '11', name: 'Marketing', type: 'expense', color: '#8b5cf6' },
  { id: '12', name: 'Salários', type: 'expense', color: '#dc2626' },
  { id: '13', name: 'Impostos', type: 'expense', color: '#7c2d12' },
  { id: '14', name: 'Energia', type: 'expense', color: '#f97316' },
  { id: '15', name: 'Telefone/Internet', type: 'expense', color: '#0ea5e9' },
  { id: '16', name: 'Combustível', type: 'expense', color: '#059669' },
  { id: '17', name: 'Manutenção', type: 'expense', color: '#7c3aed' },
  { id: '18', name: 'Material de Escritório', type: 'expense', color: '#be123c' },
  { id: '19', name: 'Viagens', type: 'expense', color: '#0d9488' },
  { id: '20', name: 'Outros', type: 'expense', color: '#64748b' },
  { id: '21', name: 'Cartão de Crédito', type: 'expense', color: '#6366f1' },
];

// Map Supabase transaction to the UI Transaction type
function mapToUITransaction(t: SupaTransaction): Transaction {
  return {
    id: t.id,
    type: t.type as 'income' | 'expense',
    description: t.description,
    amount: Number(t.amount),
    category: t.category || 'Outros',
    dueDate: t.date,
    status: (t.status as 'paid' | 'pending' | 'overdue') || 'pending',
    isRecurring: t.is_recurring || false,
    recurringFrequency: t.recurring_frequency as Transaction['recurringFrequency'],
  };
}

export const useFinancialData = () => {
  const {
    transactions: supaTransactions,
    isLoading,
    addTransaction: supaAddTransaction,
    updateTransaction: supaUpdateTransaction,
    deleteTransaction: supaDeleteTransaction,
  } = useTransactions();

  const [categories] = useState<Category[]>(initialCategories);

  // Map supabase transactions to UI transactions
  const transactions: Transaction[] = useMemo(() => {
    return supaTransactions.map(mapToUITransaction);
  }, [supaTransactions]);

  const notifications = useNotifications(transactions);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingExpenses = transactions
      .filter(t => t.type === 'expense' && (t.status === 'pending' || t.status === 'overdue'))
      .reduce((sum, t) => sum + t.amount, 0);

    const overdueCount = transactions.filter(t => t.status === 'overdue').length;

    return {
      currentBalance: totalIncome - totalExpenses,
      projectedBalance: totalIncome - totalExpenses + pendingIncome - pendingExpenses,
      totalIncome,
      totalExpenses,
      pendingIncome,
      pendingExpenses,
      overdueCount
    };
  }, [transactions]);

  const markTransactionAsPaid = useCallback(async (transactionId: string, paymentMethod: string, paymentDate?: string) => {
    await supaUpdateTransaction(transactionId, {
      status: 'paid',
      notes: `Pago via ${paymentMethod}`,
    });
  }, [supaUpdateTransaction]);

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, 'id'>) => {
    await supaAddTransaction({
      type: newTransaction.type,
      description: newTransaction.description,
      amount: newTransaction.amount,
      category: newTransaction.category || null,
      date: newTransaction.dueDate,
      status: newTransaction.status || 'pending',
      is_recurring: newTransaction.isRecurring || false,
      recurring_frequency: (newTransaction.recurringFrequency as any) || null,
      notes: newTransaction.paymentMethod ? `Método: ${newTransaction.paymentMethod}` : null,
    });
  }, [supaAddTransaction]);

  const updateTransaction = useCallback(async (transactionId: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    await supaUpdateTransaction(transactionId, {
      type: updatedTransaction.type,
      description: updatedTransaction.description,
      amount: updatedTransaction.amount,
      category: updatedTransaction.category || null,
      date: updatedTransaction.dueDate,
      status: updatedTransaction.status || 'pending',
      is_recurring: updatedTransaction.isRecurring || false,
      recurring_frequency: (updatedTransaction.recurringFrequency as any) || null,
      notes: updatedTransaction.paymentMethod ? `Método: ${updatedTransaction.paymentMethod}` : null,
    });
  }, [supaUpdateTransaction]);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    await supaDeleteTransaction(transactionId);
  }, [supaDeleteTransaction]);

  return {
    transactions,
    categories,
    summary,
    isLoading,
    markTransactionAsPaid,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    notifications,
  };
};
