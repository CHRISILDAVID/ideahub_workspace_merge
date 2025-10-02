import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

/**
 * AuthCallback page - no longer needed with JWT auth
 * Just redirects to home page
 */
export const AuthCallback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Redirecting to home...');
        // Simple redirect - no email confirmation needed with JWT auth
        router.push('/');
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
          Redirecting...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait a moment.
        </p>
      </div>
    </div>
  );
};