import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const CreatePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated (pass message via query param)
        router.push('/login?from=/create&message=' + encodeURIComponent('Please sign in to create a new idea'));
        return;
      }

      if (!user) {
        // Wait a bit for user data to load
        setTimeout(() => {
          if (!user) {
            router.push('/login');
          }
        }, 1000);
        return;
      }

      // User is authenticated, redirect to new idea creation
      setIsRedirecting(false);
      router.push('/ideas/new');
    };

    handleRedirect();
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          {isRedirecting ? 'Preparing your workspace...' : 'Redirecting to create...'}
        </p>
      </div>
    </div>
  );
}; 