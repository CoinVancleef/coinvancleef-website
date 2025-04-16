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
  const [loading, setLoading] = useState(true); // Start with loading true
  const router = useRouter();
  const client = useApolloClient();

  // Initialize auth state from localStorage on component mount (client-side only)
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');

          if (token && storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);

              // Ensure token is valid by setting headers for future requests
              // No need to reset Apollo - the auth link will handle the token
              console.log('Auth restored for user:', parsedUser.email);
            } catch (parseError) {
              console.error('Error parsing stored user:', parseError);
              // Invalid data - clear it
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Login function
  const login = (token: string, userData: User) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setUser(userData);
      console.log('User logged in:', userData.email);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setUser(null);

      // Clear Apollo cache to remove any authenticated data
      client.resetStore().catch(err => {
        console.error('Error resetting Apollo store during logout:', err);
      });

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect to login in case of errors
      window.location.href = '/login';
    }
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
