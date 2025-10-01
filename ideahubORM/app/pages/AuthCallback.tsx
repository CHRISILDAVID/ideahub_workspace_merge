import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { authCookieManager } from '../utils/authCookieManager';
import { Loader2 } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // First, try to get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=confirmation_failed');
          return;
        }

        if (data.session) {
          // Session exists, ensure cookies are properly set
          await authCookieManager.initializeFromCookies();
          
          // User is confirmed and logged in
          router.push('/?confirmed=true');
        } else {
          // No session, check if we can restore from cookies
          const authData = await authCookieManager.handlePageReload();
          
          if (authData?.session) {
            router.push('/?confirmed=true');
          } else {
            // No valid session found, redirect to login
            router.push('/login');
          }
        }
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