import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/app/types';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing authentication...');
        
        // Try to restore user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthContext: Restored user from localStorage:', parsedUser.username);
          setUser(parsedUser);
        } else {
          console.log('AuthContext: No stored user found');
        }
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Call the auth API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('AuthContext: User logged in:', data.user.username);
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Call the users API endpoint to create a new user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          username: userData.username,
          fullName: userData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('AuthContext: User registered:', data.user.username);
      }
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    console.log('AuthContext: Logging out user');
    setUser(null);
    localStorage.removeItem('user');
    
    // Call the logout API endpoint
    fetch('/api/auth/logout', {
      method: 'POST',
    }).catch(error => {
      console.error('AuthContext: Logout API error:', error);
    });
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Call the users API endpoint to update the user
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('AuthContext: User profile updated:', data.user.username);
      }
    } catch (error) {
      console.error('AuthContext: Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
