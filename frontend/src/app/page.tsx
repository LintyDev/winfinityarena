'use client';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import axiosClient from '@/lib/axiosClient';

export default function Home() {
  const auth = useAuth();

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:3333/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const ress = await res.json();
      console.log(ress);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAdmin = async () => {
    try {
      const res = await axiosClient.get('/me');
      console.log('CHECK ADMIN', res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {auth?.user ? (
        <div>
          <p>{auth.user.username}</p>
          <button className="text-blue-500" onClick={checkAdmin}>
            Check Admin
          </button>
          <button className="text-white" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
