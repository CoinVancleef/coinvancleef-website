import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

interface User {
  public_uuid: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  loading: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
};

// Create the context with a default implementation
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Safe context hook
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const client = useApolloClient();

  // Initialize auth state from localStorage on component mount (client-side only)
  useEffect(() => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (token: string, userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);

    // Clear Apollo cache to remove any authenticated data
    client.resetStore();

    // Redirect to login page
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
