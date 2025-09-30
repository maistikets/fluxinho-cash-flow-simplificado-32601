import { useState, useEffect } from 'react';
import { Transaction } from '@/types/financial';
import { addWeeks, addMonths, addYears, parseISO, isBefore, format } from 'date-fns';

export const useRecurringTransactions = () => {
  const [recurringTransactions, setRecurringTransactions] = useState<Transaction[]>([]);

  const generateNextOccurrence = (transaction: Transaction): Transaction | null => {
    if (!transaction.isRecurring || !transaction.recurringFrequency) return null;

    const currentDueDate = parseISO(transaction.dueDate);
    const endDate = transaction.recurringEndDate ? parseISO(transaction.recurringEndDate) : null;
    
    let nextDate: Date;
    
    switch (transaction.recurringFrequency) {
      case 'weekly':
        nextDate = addWeeks(currentDueDate, 1);
        break;
      case 'monthly':
        nextDate = addMonths(currentDueDate, 1);
        break;
      case 'quarterly':
        nextDate = addMonths(currentDueDate, 3);
        break;
      case 'yearly':
        nextDate = addYears(currentDueDate, 1);
        break;
      default:
        return null;
    }

    // Verificar se a próxima data não ultrapassou a data de fim
    if (endDate && isBefore(endDate, nextDate)) {
      return null;
    }

    return {
      ...transaction,
      id: `${transaction.id}_${Date.now()}`,
      dueDate: format(nextDate, 'yyyy-MM-dd'),
      status: 'pending' as const,
      paymentMethod: undefined,
      parentTransactionId: transaction.parentTransactionId || transaction.id
    };
  };

  const generateRecurringTransactions = (transactions: Transaction[]): Transaction[] => {
    const generatedTransactions: Transaction[] = [];
    const today = new Date();

    transactions.forEach(transaction => {
      if (!transaction.isRecurring || transaction.status !== 'paid') return;

      const dueDate = parseISO(transaction.dueDate);
      
      // Se a transação já foi paga e é passada, gerar a próxima
      if (isBefore(dueDate, today)) {
        const nextOccurrence = generateNextOccurrence(transaction);
        if (nextOccurrence) {
          generatedTransactions.push(nextOccurrence);
        }
      }
    });

    return generatedTransactions;
  };

  const updateRecurringTransaction = (
    transactionId: string, 
    isRecurring: boolean, 
    frequency?: Transaction['recurringFrequency'],
    endDate?: string
  ) => {
    setRecurringTransactions(prev => 
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

  return {
    recurringTransactions,
    setRecurringTransactions,
    generateRecurringTransactions,
    updateRecurringTransaction,
    generateNextOccurrence
  };
};