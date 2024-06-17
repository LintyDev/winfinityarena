'use client';
import axiosClient from '@/lib/axiosClient';
import User, { UserInput } from '@/types/user';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useLayoutEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (data: UserInput) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: UserInput) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const login = async (data: UserInput) => {
    const res = await axiosClient.post('/auth/login', JSON.stringify(data));
    if (res.data.success) {
      setUser(res.data.user);
      router.push('/');
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.log('Error on logout', error);
      setUser(null);
    } finally {
      router.push('/auth/login');
    }
  };

  const register = async (data: UserInput) => {
    const res = await axiosClient.post('/auth/register', JSON.stringify(data));
    if (res.data.success) {
      setUser(res.data.user);
      router.push('/');
    }
  };

  useLayoutEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosClient.get('/me');
        setUser(res.data);
      } catch (error) {
        setUser(null);
        if (pathname !== '/auth/login' && pathname !== '/auth/register') {
          router.push('/auth/login');
        }
      }
    };

    checkUser();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
