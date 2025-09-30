import { useState, useMemo, useEffect } from 'react';
import { Transaction, Category } from '@/types/financial';
import { useNotifications } from '@/hooks/useNotifications';
import { useRecurringTransactions } from '@/hooks/useRecurringTransactions';

const initialCategories: Category[] = [
  // Categorias de Receita
  { id: '1', name: 'Vendas', type: 'income', color: '#10b981' },
  { id: '2', name: 'Serviços', type: 'income', color: '#3b82f6' },
  { id: '3', name: 'Consultoria', type: 'income', color: '#8b5cf6' },
  { id: '4', name: 'Freelances', type: 'income', color: '#f59e0b' },
  { id: '5', name: 'Comissões', type: 'income', color: '#06b6d4' },
  { id: '6', name: 'Royalties', type: 'income', color: '#84cc16' },
  { id: '7', name: 'Investimentos', type: 'income', color: '#6366f1' },
  { id: '8', name: 'Outros', type: 'income', color: '#64748b' },
  
  // Categorias de Despesa
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
];

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    description: 'Venda de produtos - Cliente João',
    amount: 1500,
    category: 'Vendas',
    dueDate: '2025-01-25',
    status: 'paid',
    client: 'João Silva'
  },
  {
    id: '2',
    type: 'expense',
    description: 'Aluguel do escritório',
    amount: 800,
    category: 'Aluguel',
    dueDate: '2025-01-30',
    status: 'pending'
  },
  {
    id: '3',
    type: 'income',
    description: 'Projeto de design - Cliente Maria',
    amount: 2500,
    category: 'Serviços',
    dueDate: '2025-01-28',
    status: 'pending',
    client: 'Maria Santos'
  },
  {
    id: '4',
    type: 'expense',
    description: 'Compra de materiais',
    amount: 650,
    category: 'Fornecedores',
    dueDate: '2025-01-20',
    status: 'overdue'
  },
];

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories] = useState<Category[]>(initialCategories);
  
  const notifications = useNotifications(transactions);
  const recurringHook = useRecurringTransactions();

  // Gerar transações recorrentes automaticamente
  useEffect(() => {
    const generated = recurringHook.generateRecurringTransactions(transactions);
    if (generated.length > 0) {
      setTransactions(prev => [...prev, ...generated]);
    }
  }, [transactions, recurringHook]);

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

  const markTransactionAsPaid = (transactionId: string, paymentMethod: string, paymentDate?: string) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === transactionId
          ? { 
              ...transaction, 
              status: 'paid' as const, 
              paymentMethod,
              paymentDate: paymentDate || new Date().toISOString().split('T')[0]
            }
          : transaction
      )
    );
  };

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const updateTransactionRecurrence = (
    transactionId: string,
    isRecurring: boolean,
    frequency?: Transaction['recurringFrequency'],
    endDate?: string
  ) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId
          ? {
              ...transaction,
              isRecurring,
              recurringFrequency: isRecurring ? frequency : undefined,
              recurringEndDate: isRecurring ? endDate : undefined
            }
          : transaction
      )
    );
  };

  const updateTransaction = (transactionId: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId
          ? { ...updatedTransaction, id: transactionId }
          : transaction
      )
    );
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
  };

  return {
    transactions,
    categories,
    summary,
    setTransactions,
    markTransactionAsPaid,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateTransactionRecurrence,
    notifications,
    recurringHook
  };
};
