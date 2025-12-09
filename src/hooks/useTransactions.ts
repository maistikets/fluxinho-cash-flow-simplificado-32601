import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string | null;
  date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  is_recurring: boolean;
  recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setTransactions((data || []) as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Erro ao carregar transações",
        description: "Não foi possível carregar suas transações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: TransactionInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data as Transaction, ...prev]);

      toast({
        title: "Transação adicionada!",
        description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} registrada com sucesso.`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Erro ao adicionar",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<TransactionInput>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev =>
        prev.map(t => (t.id === id ? (data as Transaction) : t))
      );

      toast({
        title: "Transação atualizada!",
        description: "As alterações foram salvas.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));

      toast({
        title: "Transação removida!",
        description: "A transação foi excluída.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const getIncomes = useCallback(() => {
    return transactions.filter(t => t.type === 'income');
  }, [transactions]);

  const getExpenses = useCallback(() => {
    return transactions.filter(t => t.type === 'expense');
  }, [transactions]);

  const getTotalIncome = useCallback(() => {
    return getIncomes().reduce((sum, t) => sum + Number(t.amount), 0);
  }, [getIncomes]);

  const getTotalExpenses = useCallback(() => {
    return getExpenses().reduce((sum, t) => sum + Number(t.amount), 0);
  }, [getExpenses]);

  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpenses();
  }, [getTotalIncome, getTotalExpenses]);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
    getIncomes,
    getExpenses,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
  };
}
