/**
 * DEPRECATED: Supabase stub file
 * This file is a placeholder for components that still reference Supabase.
 * Supabase has been replaced with Prisma/PostgreSQL.
 * TODO Phase 5: Remove all Supabase references and delete this file
 */

// Stub to prevent import errors
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ data: null, error: new Error('Supabase deprecated - use Prisma API') }),
    }),
    insert: () => ({ data: null, error: new Error('Supabase deprecated - use Prisma API') }),
    update: () => ({
      eq: () => ({ data: null, error: new Error('Supabase deprecated - use Prisma API') }),
    }),
    delete: () => ({
      eq: () => ({ data: null, error: new Error('Supabase deprecated - use Prisma API') }),
    }),
  }),
};

export const handleSupabaseError = (error: any) => {
  console.error('Supabase error (deprecated):', error);
  throw new Error('Supabase has been deprecated - use Prisma API routes');
};
