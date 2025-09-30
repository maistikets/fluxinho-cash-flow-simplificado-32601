import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthContextType, PlanType } from '@/types/auth';
import { getTrialDaysLeft, isTrialExpired, createTrialUser } from '@/utils/trialHelpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@financeiro.com',
    role: 'admin',
    planType: 'premium',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    subscriptionStartDate: '2024-01-15T10:00:00Z',
    lastPaymentDate: '2024-05-15T10:00:00Z',
    nextPaymentDate: '2024-06-15T10:00:00Z',
    totalPaid: 149.70,
    monthlyRevenue: 29.90
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'teste@financeiro.com',
    role: 'user',
    planType: 'trial',
    isActive: true,
    createdAt: '2024-05-20T14:30:00Z',
    trialStartDate: '2024-05-20T14:30:00Z',
    trialEndDate: '2024-05-27T14:30:00Z',
    totalPaid: 0,
    monthlyRevenue: 0,
    isTrialExpired: false
  }
];

const VALID_CREDENTIALS = {
  'admin@financeiro.com': 'admin123',
  'teste@financeiro.com': '123456'
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('AuthProvider initializing');
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('auth-user');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading auth-user from localStorage:', error);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('admin-users');
      return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
    } catch (error) {
      console.error('Error loading admin-users from localStorage:', error);
      return defaultUsers;
    }
  });

  useEffect(() => {
    localStorage.setItem('admin-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth-user');
    }
  }, [user]);

  const checkTrialStatus = useCallback(() => {
    if (user && user.planType === 'trial') {
      const expired = isTrialExpired(user);
      if (user.isTrialExpired !== expired) {
        setUser(prev => prev ? { ...prev, isTrialExpired: expired } : null);
      }
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const foundUser = users.find(u => u.email === email);
      const validPassword = VALID_CREDENTIALS[email as keyof typeof VALID_CREDENTIALS];
      
      if (!foundUser || !validPassword || password !== validPassword) {
        throw new Error('Credenciais inválidas');
      }

      setUser(foundUser);
    } catch (error: any) {
      console.error('Failed to sign in:', error);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const baseUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user' as const,
        planType: 'trial' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        totalPaid: 0,
        monthlyRevenue: 0
      };

      const newUser = createTrialUser(baseUser);
      setUser(newUser);
      setUsers(prev => [...prev, newUser]);
    } catch (error: any) {
      console.error('Failed to sign up:', error);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setUser(null);
    } catch (error: any) {
      console.error('Failed to sign out:', error);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = signOut;

  const updateUser = (id: string, updates: Partial<User>): boolean => {
    const currentDate = new Date().toISOString();
    
    // Se estiver mudando o plano, aplicar lógica de data
    if (updates.planType && updates.planType !== users.find(u => u.id === id)?.planType) {
      return changeUserPlan(id, updates.planType);
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        const finalUpdates = { ...updates };
        
        // Se mudando status para ativo/inativo, registrar data
        if ('isActive' in updates) {
          if (updates.isActive) {
            finalUpdates.subscriptionStartDate = currentDate;
          }
        }
        
        return { ...user, ...finalUpdates };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    if (user?.id === id) {
      const updatedUser = updatedUsers.find(u => u.id === id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return true;
  };

  const deleteUser = (id: string): boolean => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    if (user?.id === id) {
      setUser(null);
    }
    return true;
  };

  const createUser = (newUser: Omit<User, 'id'>): boolean => {
    if (users.some(user => user.email === newUser.email)) {
      return false;
    }

    const user: User = {
      ...newUser,
      id: Date.now().toString(),
    };
    setUsers(prevUsers => [...prevUsers, user]);
    return true;
  };

  const getAllUsers = useCallback(() => {
    return users;
  }, [users]);

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  const toggleUserStatus = (id: string): boolean => {
    const currentDate = new Date().toISOString();
    const targetUser = users.find(u => u.id === id);
    
    if (!targetUser) return false;
    
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        const updates: Partial<User> = {
          isActive: !user.isActive
        };
        
        // Se ativando usuário, registrar data de reativação
        if (!user.isActive) {
          updates.subscriptionStartDate = currentDate;
        }
        
        return { ...user, ...updates };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // Atualizar usuário logado se necessário
    if (user?.id === id) {
      const updatedUser = updatedUsers.find(u => u.id === id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    
    return true;
  };

  const changeUserPlan = (id: string, newPlan: PlanType): boolean => {
    const currentDate = new Date().toISOString();
    
    // Buscar informações do plano no contexto de planos
    const planPrices = {
      trial: 0,
      basic: 29.90,
      premium: 76.23, // trimestral
      annual: 239.28
    };

    const planPeriods = {
      trial: 0,
      basic: 30, // dias
      premium: 90, // dias (trimestral)
      annual: 365 // dias
    };

    const calculateNextPayment = (plan: PlanType): string => {
      if (plan === 'trial') return '';
      
      const now = new Date();
      const daysToAdd = planPeriods[plan];
      const nextPayment = new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
      return nextPayment.toISOString();
    };

    const updatedUsers = users.map(user => {
      if (user.id === id) {
        const updates: Partial<User> = {
          planType: newPlan,
          subscriptionStartDate: currentDate,
          lastPaymentDate: newPlan !== 'trial' ? currentDate : undefined,
          nextPaymentDate: calculateNextPayment(newPlan),
          monthlyRevenue: newPlan === 'basic' ? planPrices.basic : 
                         newPlan === 'premium' ? planPrices.premium / 3 : // dividido por 3 meses
                         newPlan === 'annual' ? planPrices.annual / 12 : // dividido por 12 meses
                         0,
          isActive: true
        };

        // Se mudando de trial para plano pago, remover campos de trial
        if (user.planType === 'trial' && newPlan !== 'trial') {
          updates.trialStartDate = undefined;
          updates.trialEndDate = undefined;
          updates.isTrialExpired = false;
        }

        // Se mudando para trial, configurar trial
        if (newPlan === 'trial') {
          const trialStart = new Date();
          const trialEnd = new Date(trialStart.getTime() + (7 * 24 * 60 * 60 * 1000));
          updates.trialStartDate = trialStart.toISOString();
          updates.trialEndDate = trialEnd.toISOString();
          updates.isTrialExpired = false;
          updates.subscriptionStartDate = undefined;
          updates.lastPaymentDate = undefined;
          updates.nextPaymentDate = undefined;
        }

        return { ...user, ...updates };
      }
      return user;
    });

    setUsers(updatedUsers);
    
    // Atualizar usuário logado se for ele que teve o plano alterado
    if (user?.id === id) {
      const updatedUser = updatedUsers.find(u => u.id === id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    
    return true;
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    logout,
    updateUser,
    deleteUser,
    createUser,
    getAllUsers,
    getUserById,
    toggleUserStatus,
    changeUserPlan,
    getTrialDaysLeft,
    isTrialExpired,
    checkTrialStatus
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
