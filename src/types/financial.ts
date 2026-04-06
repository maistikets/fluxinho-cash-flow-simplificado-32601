
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

export interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  last_four_digits: string | null;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditCardTransaction {
  id: string;
  user_id: string;
  card_id: string;
  transaction_id: string | null;
  description: string;
  total_amount: number;
  installment_number: number;
  total_installments: number;
  installment_amount: number;
  reference_month: string;
  created_at: string;
}
