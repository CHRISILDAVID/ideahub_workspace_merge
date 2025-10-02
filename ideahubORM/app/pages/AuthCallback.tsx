import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Auth callback page for email confirmation
 * Note: This is a stub implementation for the Prisma migration.
 * Actual auth implementation will be added in Step 5.
 */
export const AuthCallback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Processing authentication callback...');
        
        // For now, just redirect to home
        // In Step 5, this will handle email confirmation and session setup
        setTimeout(() => {
          router.push('/?confirmed=true');
        }, 1000);
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        router.push('/login?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Confirming your account...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we verify your email address.
        </p>
      </div>
    </div>
  );
};