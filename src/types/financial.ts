
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  client?: string;
  phone?: string;
  paymentMethod?: string;
  paymentDate?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  recurringEndDate?: string;
  parentTransactionId?: string;
}

export interface NotificationAlert {
  id: string;
  transactionId: string;
  type: 'due_soon' | 'overdue' | 'recurring_generated';
  message: string;
  dueDate: string;
  isRead: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}
