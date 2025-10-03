'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Give some time for the auth context to initialize from cookies
    const timer = setTimeout(() => {
      setHasCheckedAuth(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated after checking
    if (hasCheckedAuth && !isLoading && (!isAuthenticated || !user)) {
      console.log('ProtectedRoute: User not authenticated, redirecting to login');
      const search = searchParams?.toString() || '';
      const currentPath = pathname + (search ? `?${search}` : '');
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [hasCheckedAuth, isLoading, isAuthenticated, user, router, pathname, searchParams, redirectTo]);

  // Show loading while checking authentication or during initial auth check
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {!hasCheckedAuth ? 'Checking authentication...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  console.log('ProtectedRoute: User authenticated, allowing access to protected route');
  return <>{children}</>;
};
