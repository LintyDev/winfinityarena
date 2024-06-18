'use client';

import StartMenu from '@/components/StartMenu';
import { useAuth } from '@/contexts/AuthContext';

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
    <main className="flex flex-col items-center">
      <StartMenu />
    </main>
  );
}
