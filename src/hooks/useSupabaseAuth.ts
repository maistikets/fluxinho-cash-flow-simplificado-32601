import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: 'trial' | 'basic' | 'premium' | 'annual';
  is_active: boolean;
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_start_date: string | null;
  last_payment_date: string | null;
  next_payment_date: string | null;
  total_paid: number;
  monthly_revenue: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (profileData) setProfile(profileData as UserProfile);

      // Fetch subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (subscriptionError) throw subscriptionError;
      if (subscriptionData) setSubscription(subscriptionData as UserSubscription);

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (rolesError) throw rolesError;
      if (rolesData) setRoles(rolesData as UserRole[]);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setSubscription(null);
          setRoles([]);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, [fetchUserData]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Conta criada!",
        description: "Sua conta foi criada com sucesso.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      let message = "Erro ao criar conta";
      
      if (error.message?.includes('already registered')) {
        message = "Este email já está cadastrado";
      }
      
      toast({
        title: "Erro no cadastro",
        description: message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
      setSubscription(null);
      setRoles([]);

      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = useCallback(() => {
    return roles.some(r => r.role === 'admin');
  }, [roles]);

  const isTrialExpired = useCallback(() => {
    if (!subscription) return false;
    if (subscription.plan_type !== 'trial') return false;
    if (!subscription.trial_end_date) return false;
    
    return new Date(subscription.trial_end_date) < new Date();
  }, [subscription]);

  const getTrialDaysLeft = useCallback(() => {
    if (!subscription) return 0;
    if (subscription.plan_type !== 'trial') return 0;
    if (!subscription.trial_end_date) return 0;
    
    const endDate = new Date(subscription.trial_end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }, [subscription]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const refreshUserData = useCallback(async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  return {
    user,
    session,
    profile,
    subscription,
    roles,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isTrialExpired,
    getTrialDaysLeft,
    updateProfile,
    refreshUserData,
  };
}
