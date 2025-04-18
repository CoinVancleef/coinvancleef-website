import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useApolloClient, gql } from '@apollo/client';

const GET_USER_PROFILE = gql`
  query GetUserProfile($publicUuid: String!) {
    user(publicUuid: $publicUuid) {
      public_uuid
      email
      name
      role
      profilePicture
    }
  }
`;

interface User {
  public_uuid: string;
  email: string;
  name?: string;
  role: string;
  profilePicture?: string | null;
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

  // Function to fetch full user data if needed
  const fetchUserData = async (publicUuid: string) => {
    try {
      const { data } = await client.query({
        query: GET_USER_PROFILE,
        variables: { publicUuid },
        fetchPolicy: 'network-only',
      });

      if (data?.user) {
        // Update user state with complete data
        setUser(data.user);

        // Update localStorage with complete user data
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      // Silent error handling
    }
  };

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

              // If profile picture is missing, fetch complete user data
              if (!parsedUser.profilePicture) {
                fetchUserData(parsedUser.public_uuid);
              }
            } catch (parseError) {
              // Invalid data - clear it
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        // Silent error handling
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

      // Check if profile picture is missing and fetch complete data if needed
      if (!userData.profilePicture) {
        fetchUserData(userData.public_uuid);
      }
    } catch (error) {
      // Silent error handling
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
      client.resetStore().catch(() => {
        // Silent error handling
      });

      // Redirect to login page
      router.push('/login');
    } catch (error) {
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
