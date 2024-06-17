'use client';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import axiosClient from '@/lib/axiosClient';

export default function Home() {
  const auth = useAuth();

  const logout = async () => {
    try {
      auth?.logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center pt-5">
      <p>Hello, {auth?.user?.username}!</p>
      <button className="text-white" onClick={logout}>
        Logout
      </button>
    </main>
  );
}
