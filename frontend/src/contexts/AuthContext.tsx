'use client';
import axiosClient from '@/lib/axiosClient';
import { unprotectedRoutes } from '@/lib/unprotectedRoutes';
import User, { UserInput, UserUpdateInput } from '@/types/user';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  login: (data: UserInput) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: UserInput) => Promise<void>;
  edit: (data: UserUpdateInput) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
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

  const edit = useCallback(async (data: UserUpdateInput) => {
    const res = await axiosClient.post('/me', JSON.stringify(data));
    if (res.data.success) {
      setUser(res.data.user);
      setUpdate(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setUpdate(false);
        const res = await axiosClient.get('/me');
        setUser(res.data);
      } catch (error) {
        setUser(null);
        if (!unprotectedRoutes.includes(pathname)) {
          router.push('/auth/login');
        }
      }
    };

    checkUser();
  }, [router, pathname, update]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, edit }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
