import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useSupabaseAuth, UserProfile, UserSubscription, UserRole } from '@/hooks/useSupabaseAuth';

// Legacy User type for backward compatibility
export interface LegacyUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  planType: 'trial' | 'basic' | 'premium' | 'annual';
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

interface AuthContextType {
  user: LegacyUser | null;
  session: Session | null;
  profile: UserProfile | null;
  subscription: UserSubscription | null;
  roles: UserRole[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isTrialExpired: () => boolean;
  getTrialDaysLeft: () => number;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('AuthProvider initializing with Supabase');
  
  const auth = useSupabaseAuth();

  // Create legacy user object for backward compatibility
  const legacyUser = useMemo((): LegacyUser | null => {
    if (!auth.user) return null;
    
    return {
      id: auth.user.id,
      name: auth.profile?.name || auth.user.email || 'Usuário',
      email: auth.user.email || '',
      role: auth.roles.some(r => r.role === 'admin') ? 'admin' : 'user',
      planType: auth.subscription?.plan_type || 'trial',
      isActive: auth.subscription?.is_active ?? true,
      createdAt: auth.profile?.created_at || new Date().toISOString(),
      trialStartDate: auth.subscription?.trial_start_date || undefined,
      trialEndDate: auth.subscription?.trial_end_date || undefined,
      subscriptionStartDate: auth.subscription?.subscription_start_date || undefined,
      lastPaymentDate: auth.subscription?.last_payment_date || undefined,
      nextPaymentDate: auth.subscription?.next_payment_date || undefined,
      totalPaid: auth.subscription?.total_paid || 0,
      monthlyRevenue: auth.subscription?.monthly_revenue || 0,
      isTrialExpired: auth.isTrialExpired(),
    };
  }, [auth.user, auth.profile, auth.subscription, auth.roles, auth.isTrialExpired]);

  const value: AuthContextType = {
    user: legacyUser,
    session: auth.session,
    profile: auth.profile,
    subscription: auth.subscription,
    roles: auth.roles,
    isLoading: auth.isLoading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    logout: auth.signOut,
    isAdmin: auth.isAdmin,
    isTrialExpired: auth.isTrialExpired,
    getTrialDaysLeft: auth.getTrialDaysLeft,
    updateProfile: auth.updateProfile,
    refreshUserData: auth.refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
