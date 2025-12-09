import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  category: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type GoalInput = Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export function useSupabaseGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setGoals([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals((data || []) as Goal[]);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Erro ao carregar metas",
        description: "Não foi possível carregar suas metas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goal: GoalInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goal,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data as Goal, ...prev]);

      toast({
        title: "Meta criada!",
        description: `A meta "${goal.title}" foi criada com sucesso.`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateGoal = async (id: string, updates: Partial<GoalInput>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev =>
        prev.map(g => (g.id === id ? (data as Goal) : g))
      );

      toast({
        title: "Meta atualizada!",
        description: "As alterações foram salvas.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(g => g.id !== id));

      toast({
        title: "Meta removida!",
        description: "A meta foi excluída.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const getProgress = useCallback((goal: Goal) => {
    if (goal.target_amount <= 0) return 0;
    return Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100);
  }, []);

  const getCompletedCount = useCallback(() => {
    return goals.filter(g => g.is_completed).length;
  }, [goals]);

  const getPendingCount = useCallback(() => {
    return goals.filter(g => !g.is_completed).length;
  }, [goals]);

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    fetchGoals,
    getProgress,
    getCompletedCount,
    getPendingCount,
  };
}
