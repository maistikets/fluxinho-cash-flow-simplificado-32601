export interface MonthlyGoal {
  id: string;
  month: string; // YYYY-MM format
  incomeGoal: number;
  expenseLimit: number;
  savingsGoal: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalProgress {
  currentIncome: number;
  currentExpenses: number;
  currentSavings: number;
  incomeProgress: number; // percentage
  expenseProgress: number; // percentage  
  savingsProgress: number; // percentage
  isOnTrack: boolean;
}