import { useState, useMemo } from 'react';
import { Transaction } from '@/types/financial';
import { FilterOptions } from '@/components/TransactionFilters';
import { isToday, isWithinInterval, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

const getInitialFilters = (): FilterOptions => ({
  status: 'all',
  dateRange: 'custom',
  sortBy: 'date',
  sortOrder: 'desc',
  customStartDate: startOfMonth(new Date()),
  customEndDate: endOfMonth(new Date())
});

export const useMonthlyFilters = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState<FilterOptions>(getInitialFilters);

  const filteredAndSortedTransactions = useMemo(() => {
    try {
      if (!transactions || !Array.isArray(transactions)) {
        return [];
      }
      
      let filtered = [...transactions];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(t => isToday(new Date(t.dueDate)));
          break;
        case '7days':
          filtered = filtered.filter(t => 
            isWithinInterval(new Date(t.dueDate), {
              start: subDays(now, 7),
              end: now
            })
          );
          break;
        case '30days':
          filtered = filtered.filter(t => 
            isWithinInterval(new Date(t.dueDate), {
              start: subDays(now, 30),
              end: now
            })
          );
          break;
        case 'custom':
          if (filters.customStartDate && filters.customEndDate) {
            filtered = filtered.filter(t => 
              isWithinInterval(new Date(t.dueDate), {
                start: startOfDay(filters.customStartDate),
                end: endOfDay(filters.customEndDate)
              })
            );
          }
          break;
      }
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'status':
          const statusOrder = { 'overdue': 0, 'pending': 1, 'paid': 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'client':
          const clientA = a.client || '';
          const clientB = b.client || '';
          comparison = clientA.localeCompare(clientB);
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  } catch (error) {
    return transactions || [];
  }
  }, [transactions, filters]);

  const resetToCurrentMonth = () => {
    setFilters(getInitialFilters());
  };

  return {
    filters,
    setFilters,
    filteredTransactions: filteredAndSortedTransactions,
    resetToCurrentMonth
  };
};