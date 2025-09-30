import { useState, useEffect, useMemo } from 'react';
import { MonthlyGoal, GoalProgress } from '@/types/goals';
import { Transaction } from '@/types/financial';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const defaultGoals: MonthlyGoal[] = [
  {
    id: '1',
    month: format(new Date(), 'yyyy-MM'),
    incomeGoal: 10000,
    expenseLimit: 7000,
    savingsGoal: 3000,
    description: 'Meta padrão para o mês atual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useGoals = (transactions: Transaction[]) => {
  const [goals, setGoals] = useState<MonthlyGoal[]>(defaultGoals);

  const getCurrentMonthGoal = (): MonthlyGoal | null => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    return goals.find(goal => goal.month === currentMonth) || null;
  };

  const calculateProgress = (goal: MonthlyGoal): GoalProgress => {
    const monthStart = startOfMonth(parseISO(goal.month + '-01'));
    const monthEnd = endOfMonth(parseISO(goal.month + '-01'));

    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.dueDate);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd }) &&
             transaction.status === 'paid';
    });

    const currentIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentSavings = currentIncome - currentExpenses;

    const incomeProgress = goal.incomeGoal > 0 ? (currentIncome / goal.incomeGoal) * 100 : 0;
    const expenseProgress = goal.expenseLimit > 0 ? (currentExpenses / goal.expenseLimit) * 100 : 0;
    const savingsProgress = goal.savingsGoal > 0 ? (currentSavings / goal.savingsGoal) * 100 : 0;

    const isOnTrack = currentIncome >= goal.incomeGoal * 0.8 && 
                     currentExpenses <= goal.expenseLimit &&
                     currentSavings >= goal.savingsGoal * 0.8;

    return {
      currentIncome,
      currentExpenses,
      currentSavings,
      incomeProgress: Math.round(incomeProgress),
      expenseProgress: Math.round(expenseProgress),
      savingsProgress: Math.round(savingsProgress),
      isOnTrack
    };
  };

  const addGoal = (goal: Omit<MonthlyGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: MonthlyGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (goalId: string, updates: Partial<MonthlyGoal>) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
          : goal
      )
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const currentMonthGoal = getCurrentMonthGoal();
  const currentProgress = currentMonthGoal ? calculateProgress(currentMonthGoal) : null;

  return {
    goals,
    currentMonthGoal,
    currentProgress,
    addGoal,
    updateGoal,
    deleteGoal,
    calculateProgress
  };
};