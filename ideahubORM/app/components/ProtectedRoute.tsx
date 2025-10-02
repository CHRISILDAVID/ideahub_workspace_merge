'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Give some time for the auth context to initialize from cookies
    const timer = setTimeout(() => {
      setHasCheckedAuth(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated after auth check
    if (hasCheckedAuth && (!isAuthenticated || !user)) {
      console.log('ProtectedRoute: User not authenticated, redirecting to login');
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hasCheckedAuth, isAuthenticated, user, redirectTo, pathname, router]);

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

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: User authenticated, allowing access to protected route');
  return <>{children}</>;
};
