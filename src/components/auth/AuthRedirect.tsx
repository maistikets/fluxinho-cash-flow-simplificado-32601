
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRedirectPath } from '@/utils/redirectHelpers';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      const redirectPath = getRedirectPath(user, location.pathname);
      if (redirectPath) {
        console.log(`Redirecting from ${location.pathname} to ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthRedirect;
