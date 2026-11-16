import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: any, remember: boolean) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('mgm_auth_token') || sessionStorage.getItem('mgm_auth_token');
    const savedUser = localStorage.getItem('mgm_auth_user') || sessionStorage.getItem('mgm_auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify token with backend
        api.get('/user')
          .then((res) => {
            setUser(res.data);
            if (localStorage.getItem('mgm_auth_token')) {
              localStorage.setItem('mgm_auth_user', JSON.stringify(res.data));
            } else {
              sessionStorage.setItem('mgm_auth_user', JSON.stringify(res.data));
            }
          })
          .catch(() => {
            // Token expired or invalid
            handleLogoutClean();
          })
          .finally(() => setIsLoading(false));
      } catch {
        handleLogoutClean();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogoutClean = () => {
    localStorage.removeItem('mgm_auth_token');
    sessionStorage.removeItem('mgm_auth_token');
    localStorage.removeItem('mgm_auth_user');
    sessionStorage.removeItem('mgm_auth_user');
    setToken(null);
    setUser(null);
  };

  const login = async (credentials: any, remember: boolean): Promise<User> => {
    const res = await api.post('/login', { ...credentials, remember });
    const { user: loggedInUser, token: receivedToken } = res.data;

    setUser(loggedInUser);
    setToken(receivedToken);

    if (remember) {
      localStorage.setItem('mgm_auth_token', receivedToken);
      localStorage.setItem('mgm_auth_user', JSON.stringify(loggedInUser));
    } else {
      sessionStorage.setItem('mgm_auth_token', receivedToken);
      sessionStorage.setItem('mgm_auth_user', JSON.stringify(loggedInUser));
    }

    return loggedInUser;
  };

  const register = async (data: any): Promise<User> => {
    const res = await api.post('/register', data);
    const { user: registeredUser, token: receivedToken } = res.data;

    setUser(registeredUser);
    setToken(receivedToken);

    localStorage.setItem('mgm_auth_token', receivedToken);
    localStorage.setItem('mgm_auth_user', JSON.stringify(registeredUser));

    return registeredUser;
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout');
      }
    } catch {
      // Ignore network error on logout
    } finally {
      handleLogoutClean();
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.get('/user');
      setUser(res.data);
      if (localStorage.getItem('mgm_auth_token')) {
        localStorage.setItem('mgm_auth_user', JSON.stringify(res.data));
      } else {
        sessionStorage.setItem('mgm_auth_user', JSON.stringify(res.data));
      }
    } catch {
      // Error
    }
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    if (localStorage.getItem('mgm_auth_token')) {
      localStorage.setItem('mgm_auth_user', JSON.stringify(updated));
    } else {
      sessionStorage.setItem('mgm_auth_user', JSON.stringify(updated));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
