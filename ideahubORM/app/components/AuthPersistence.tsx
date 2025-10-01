'use client';

import React, { useEffect, useState } from 'react';

interface AuthPersistenceProps {
  children: React.ReactNode;
}

/**
 * Component that ensures authentication state is properly restored from cookies
 * Should wrap the entire app to handle auth persistence
 */
export const AuthPersistence: React.FC<AuthPersistenceProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthPersistence: Initializing auth state from cookies...');
        
        // Auth is now handled by AuthContext
        console.log('AuthPersistence: Auth initialization delegated to AuthContext');
      } catch (error) {
        console.error('AuthPersistence: Error initializing auth persistence:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Show loading while initializing auth
  if (!isInitialized) {
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
