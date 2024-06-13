import axios from 'axios';
import {createContext, ReactNode, useContext, useState} from 'react'
interface AuthContextProps {
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3000/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.status === 200) {
        console.log('Login successful');
        setIsLoggedIn(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed');
      return false;
    }
  };

    const logout = async () => {
        try {
          const response = await axios.get('http://localhost:3000/auth/logout');
            if(response.status === 200) {
                setIsLoggedIn(false);
            } 
        } catch (error) {
            console.error('Logout failed');
        }
    }

    return <AuthContext.Provider value={{isLoggedIn, login, logout}}>{children}</AuthContext.Provider>
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};