import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Supabase imports removed - will be replaced with custom auth in Phase 5
// import { supabase } from '@/lib/supabase';
// import { supabaseApi } from '@/app/services/api/index';
import { User } from '@/app/types';
// import { authCookieManager } from '@/app/utils/authCookieManager';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false for now

  // Simplified initialization - will be replaced with proper auth in Phase 5
  useEffect(() => {
    // TODO Phase 5: Implement proper session management
    // For now, just check localStorage for demo purposes
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('demo-user') : null;
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TODO Phase 5: Implement actual login with API
    // For now, this is a stub
    console.warn('Login called - authentication to be implemented in Phase 5');
    throw new Error('Authentication not yet implemented - Phase 5');
  };

  const register = async (userData: RegisterData) => {
    // TODO Phase 5: Implement actual registration with API
    // For now, this is a stub
    console.warn('Register called - authentication to be implemented in Phase 5');
    throw new Error('Authentication not yet implemented - Phase 5');
  };

  const logout = () => {
    // TODO Phase 5: Implement proper logout
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo-user');
    }
    console.log('User logged out');
  };

  const updateProfile = async (userData: Partial<User>) => {
    // TODO Phase 5: Implement actual profile update with API
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo-user', JSON.stringify(updatedUser));
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
