import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectTo = '/login', requireAuth = true } = options;
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const requireAuthentication = () => {
    if (!isLoading && !isAuthenticated && requireAuth) {
      const currentPath = pathname;
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return false;
    }
    return isAuthenticated || !requireAuth;
  };

  const checkAuthForAction = (action: () => void, errorMessage = 'You must be logged in to perform this action') => {
    if (!isAuthenticated) {
      // You could show a toast notification here
      console.warn(errorMessage);
      requireAuthentication();
      return false;
    }
    action();
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    requireAuthentication,
    checkAuthForAction,
    canAccess: isAuthenticated || !requireAuth,
  };
};
