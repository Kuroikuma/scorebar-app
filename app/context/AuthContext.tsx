import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../service/api';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface DecodedToken {
  exp: number; // Expiration time (UNIX timestamp)
  userId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }, [router])

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && storedUser) {
      const decoded: DecodedToken = jwtDecode(token);
      const isTokenExpired = decoded.exp * 1000 < new Date().getTime();

      if (isTokenExpired) {
        logout();
      } else {
        setUser(JSON.parse(storedUser));
        setTokenExpirationTimeout(decoded.exp * 1000);
      }
    }
    setLoading(false);
  }, [logout]);

  const setTokenExpirationTimeout = (expirationTime: number) => {
    const timeout = expirationTime - new Date().getTime();
    setTimeout(() => {
      logout();
    }, timeout);
  };

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await apiRegister(username, email, password);
    setUser(response);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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

