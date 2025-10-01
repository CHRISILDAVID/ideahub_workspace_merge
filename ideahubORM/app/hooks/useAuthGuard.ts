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
  const location = useLocation();

  const requireAuthentication = () => {
    if (!isLoading && !isAuthenticated && requireAuth) {
      const currentPath = pathname + location.search;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
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
