// src/context/authContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminLogin, logout as authLogout, isAdmin as checkIsAdmin, isAuthenticated as checkIsAuthenticated } from '@/services/authService';

type UserType = {
  _id: string;
  username: string;
  role: string;
};

type AuthContextType = {
  user: UserType | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const authenticated = checkIsAuthenticated();
    setIsAuthenticated(authenticated);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await adminLogin(username, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authLogout();
  };

  const isAdmin = checkIsAdmin();

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
