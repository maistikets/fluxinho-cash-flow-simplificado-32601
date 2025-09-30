
import { User } from '@/types/auth';

export const getTrialDaysLeft = (user: User): number => {
  if (user.planType !== 'trial' || !user.trialEndDate) {
    return 0;
  }
  
  const endDate = new Date(user.trialEndDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

export const isTrialExpired = (user: User): boolean => {
  if (user.planType !== 'trial') {
    return false;
  }
  
  return getTrialDaysLeft(user) <= 0;
};

export const isTrialExpiring = (user: User): boolean => {
  if (user.planType !== 'trial') {
    return false;
  }
  
  const daysLeft = getTrialDaysLeft(user);
  return daysLeft > 0 && daysLeft <= 2;
};

export const createTrialUser = (baseUser: Omit<User, 'trialStartDate' | 'trialEndDate'>): User => {
  const now = new Date();
  const trialEnd = new Date();
  trialEnd.setDate(now.getDate() + 7);
  
  return {
    ...baseUser,
    planType: 'trial',
    trialStartDate: now.toISOString(),
    trialEndDate: trialEnd.toISOString(),
  };
};
