import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { CreditCard, CreditCardTransaction } from '@/types/financial';

export interface CreditCardInput {
  name: string;
  brand: string;
  last_four_digits?: string;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  color?: string;
}

export function useCreditCards() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [cardTransactions, setCardTransactions] = useState<CreditCardTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCards = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCards([]); setIsLoading(false); return; }

      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards((data || []) as CreditCard[]);
    } catch (error) {
      console.error('Error fetching credit cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCardTransactions = useCallback(async (cardId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('credit_card_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('reference_month', { ascending: false });

      if (cardId) query = query.eq('card_id', cardId);

      const { data, error } = await query;
      if (error) throw error;
      setCardTransactions((data || []) as CreditCardTransaction[]);
    } catch (error) {
      console.error('Error fetching card transactions:', error);
    }
  }, []);

  useEffect(() => {
    fetchCards();
    fetchCardTransactions();
  }, [fetchCards, fetchCardTransactions]);

  const addCard = async (card: CreditCardInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('credit_cards')
        .insert({ ...card, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setCards(prev => [data as CreditCard, ...prev]);
      toast({ title: "Cartão adicionado!", description: `${card.name} foi cadastrado com sucesso.` });
      return { data, error: null };
    } catch (error: any) {
      toast({ title: "Erro ao adicionar cartão", description: error.message, variant: "destructive" });
      return { data: null, error };
    }
  };

  const updateCard = async (id: string, updates: Partial<CreditCardInput>) => {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCards(prev => prev.map(c => c.id === id ? data as CreditCard : c));
      toast({ title: "Cartão atualizado!" });
      return { data, error: null };
    } catch (error: any) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      return { data: null, error };
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase.from('credit_cards').delete().eq('id', id);
      if (error) throw error;
      setCards(prev => prev.filter(c => c.id !== id));
      toast({ title: "Cartão removido!" });
      return { error: null };
    } catch (error: any) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
      return { error };
    }
  };

  const addCardTransaction = async (tx: Omit<CreditCardTransaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('credit_card_transactions')
        .insert({ ...tx, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setCardTransactions(prev => [data as CreditCardTransaction, ...prev]);
      return { data, error: null };
    } catch (error: any) {
      toast({ title: "Erro ao registrar compra", description: error.message, variant: "destructive" });
      return { data: null, error };
    }
  };

  const getCardUsed = useCallback((cardId: string) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return cardTransactions
      .filter(t => t.card_id === cardId && t.reference_month.startsWith(currentMonth))
      .reduce((sum, t) => sum + Number(t.installment_amount), 0);
  }, [cardTransactions]);

  const getCardAvailable = useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return 0;
    return Number(card.credit_limit) - getCardUsed(cardId);
  }, [cards, getCardUsed]);

  return {
    cards,
    cardTransactions,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    addCardTransaction,
    fetchCards,
    fetchCardTransactions,
    getCardUsed,
    getCardAvailable,
  };
}
