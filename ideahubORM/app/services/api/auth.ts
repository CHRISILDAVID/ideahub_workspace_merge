// TODO: Step 4 - Replace with Prisma/API client implementation
// This is a stub implementation to allow the server to start
// The full implementation will use the API routes created in app/api/

import { User } from '../../types';

export class AuthService {
  /**
   * Sign up a new user
   * TODO: Step 4 - Implement with fetch to /api/users
   */
  static async signUp(email: string, password: string, userData: { username: string; fullName: string }) {
    console.warn('AuthService.signUp: Stub implementation - Step 4 TODO');
    // For now, return a mock response
    return { user: null };
  }

  /**
   * Sign in an existing user
   * TODO: Step 4 - Implement with fetch to /api/auth/login
   */
  static async signIn(email: string, password: string) {
    console.warn('AuthService.signIn: Stub implementation - Step 4 TODO');
    return { user: null, session: null };
  }

  /**
   * Sign out the current user
   * TODO: Step 4 - Implement with fetch to /api/auth/logout
   */
  static async signOut() {
    console.warn('AuthService.signOut: Stub implementation - Step 4 TODO');
  }

  /**
   * Get the currently authenticated user
   * TODO: Step 4 - Implement with fetch to /api/auth/session
   */
  static async getCurrentUser(): Promise<User | null> {
    console.warn('AuthService.getCurrentUser: Stub implementation - Step 4 TODO');
    // Try to get user from localStorage (set by AuthContext)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    }
    return null;
  }

  /**
   * Get the current user ID from the auth session
   * TODO: Step 4 - Implement with fetch to /api/auth/session
   */
  static async getCurrentUserId(): Promise<string | null> {
    console.warn('AuthService.getCurrentUserId: Stub implementation - Step 4 TODO');
    const user = await this.getCurrentUser();
    return user?.id || null;
  }

  /**
   * Check if user is authenticated
   * TODO: Step 4 - Implement with fetch to /api/auth/session
   */
  static async isAuthenticated(): Promise<boolean> {
    console.warn('AuthService.isAuthenticated: Stub implementation - Step 4 TODO');
    const user = await this.getCurrentUser();
    return !!user;
  }
}
