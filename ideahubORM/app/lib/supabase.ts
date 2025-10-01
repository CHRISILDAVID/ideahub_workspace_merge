/**
 * Supabase stub - Migration in progress to apiClient
 * This file provides minimal compatibility during migration
 */

// Stub for Supabase client during migration
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: new Error('Use apiClient instead') }),
    signUp: async () => ({ data: null, error: new Error('Use apiClient instead') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Use apiClient instead') })
      })
    })
  })
};

export const handleSupabaseError = (error: any) => {
  console.error('Supabase error (migration in progress):', error);
  throw error;
};
