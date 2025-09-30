
export type PlanType = 'trial' | 'basic' | 'premium' | 'annual';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  planType: PlanType;
  isActive: boolean;
  createdAt: string;
  trialStartDate?: string;
  trialEndDate?: string;
  subscriptionStartDate?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  totalPaid?: number;
  monthlyRevenue?: number;
  isTrialExpired?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => boolean;
  deleteUser: (id: string) => boolean;
  createUser: (newUser: Omit<User, 'id'>) => boolean;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  toggleUserStatus: (id: string) => boolean;
  changeUserPlan: (id: string, newPlan: PlanType) => boolean;
  getTrialDaysLeft: (user: User) => number;
  isTrialExpired: (user: User) => boolean;
  checkTrialStatus: () => void;
}
