import React, { useEffect, useState } from 'react';

interface AuthPersistenceProps {
  children: React.ReactNode;
}

/**
 * Component that ensures authentication state is properly restored from cookies
 * Should wrap the entire app to handle auth persistence
 * 
 * Note: This is a stub implementation for the Prisma migration.
 * Auth persistence is now handled by AuthContext.
 */
export const AuthPersistence: React.FC<AuthPersistenceProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthPersistence: Initializing auth state...');
        // Auth state is now managed by AuthContext using localStorage/cookies
        // This component just provides a loading screen briefly
      } catch (error) {
        console.error('AuthPersistence: Error initializing auth persistence:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    // Simulate brief initialization
    const timer = setTimeout(() => {
      initializeAuth();
    }, 100);

    return () => clearTimeout(timer);
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
