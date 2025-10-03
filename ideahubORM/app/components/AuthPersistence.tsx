import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthPersistenceProps {
  children: React.ReactNode;
}

/**
 * Component that ensures authentication state is properly restored from cookies
 * Should wrap the entire app to handle auth persistence
 */
export const AuthPersistence: React.FC<AuthPersistenceProps> = ({ children }) => {
  const { isLoading, user, refreshSession } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthPersistence: Initializing auth state from cookies...');
        
        // Trigger session refresh to check for existing session
        await refreshSession();
        
        console.log('AuthPersistence: Session check complete');
      } catch (error) {
        console.error('AuthPersistence: Error initializing auth persistence:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [refreshSession]);

  // Show loading while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Restoring authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
