
import { User } from '@/types/auth';
import { isTrialExpired } from './trialHelpers';

export const getRedirectPath = (user: User | null, currentPath: string): string | null => {
  if (!user) {
    // Usuário não logado
    const protectedPaths = ['/dashboard', '/profile', '/plan-settings'];
    const isAdminPath = currentPath.startsWith('/admin');
    
    if (protectedPaths.includes(currentPath) || isAdminPath) {
      return '/login';
    }
    return null;
  }

  // Usuário logado
  if (user.role === 'admin') {
    // Lógica para admin
    if (!currentPath.startsWith('/admin') && currentPath !== '/') {
      return '/admin';
    }
    return null;
  }

  // Usuário comum
  if (currentPath.startsWith('/admin')) {
    return '/dashboard';
  }

  if (currentPath === '/login') {
    return '/dashboard';
  }

  if (currentPath === '/') {
    return '/dashboard';
  }

  // Verificar trial expirado - permitir acesso às páginas de pagamento
  const paymentPaths = ['/plans', '/checkout', '/payment-success', '/payment-canceled'];
  if (isTrialExpired(user) && !paymentPaths.includes(currentPath)) {
    return '/plans';
  }

  return null;
};
