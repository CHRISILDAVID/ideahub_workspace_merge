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
    onAuthStateChange: (_callback: (event: string, session: any) => void) => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: (_table: string) => ({
    select: () => ({
      eq: async (_field: string, _value: any) => ({ data: null, error: new Error('Use apiClient instead') }),
      single: async () => ({ data: null, error: new Error('Use apiClient instead') })
    }),
    update: (_data: any) => ({
      eq: async (_field: string, _value: any) => ({ data: null, error: new Error('Use apiClient instead') })
    })
  }),
  rpc: async (_name: string, _params?: any) => ({ data: null, error: new Error('Use apiClient instead') })
};

export const handleSupabaseError = (error: any) => {
  console.error('Supabase error (migration in progress):', error);
  throw error;
};
