'use client';
import axiosClient from '@/lib/axiosClient';
import User, { UserInput } from '@/types/user';
import { createContext, useContext, useLayoutEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (data: UserInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (data: UserInput) => {
    try {
      const res = await axiosClient.post('/auth/login', JSON.stringify(data));
      setUser(res.data);
    } catch (error) {
      console.log('Not authenticated', error);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.get('/auth/logout');
      setUser(null);
    } catch (error) {
      console.log('Error on logout', error);
      setUser(null);
    }
  };

  useLayoutEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosClient.get('/me');
        setUser(res.data);
      } catch (error) {
        setUser(null);
        console.log('Not authenticated', error);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
