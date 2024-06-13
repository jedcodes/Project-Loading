import { createContext, useContext, useState, ReactNode } from 'react';
import { adminLogin, logout as logoutService, isAuthenticated } from '@/services/authService';

interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const login = async (username: string, password: string) => {
    await adminLogin(username, password);
    setAuthenticated(true);
  };

  const logout = () => {
    logoutService();
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated: authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
