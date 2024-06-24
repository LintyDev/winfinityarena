'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '@/assets/img/logo.png';

function Header() {
  const auth = useAuth();
  const router = useRouter();

  const logout = async () => {
    try {
      auth?.logout();
    } catch (error) {
      console.log(error);
    }
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="w-full flex justify-between items-center pt-2 pb-[10px] px-[20px] bg-purple-950">
      <p className="subtitle cursor-pointer" onClick={goToHome}>
        <span className="hidden sm:block">WinfinityArena</span>
        <span className="sm:hidden">Winfinity</span>
      </p>
      <div className="flex justify-between gap-4 items-center">
        <p className="hidden md:block">Bienvenue, {auth?.user?.username}!</p>
        <p
          className="win-btn-small blue"
          onClick={() => router.push('/profile')}
        >
          Mon profil
        </p>
        <p className="win-btn-small red" onClick={logout}>
          Déconnexion
        </p>
      </div>
    </div>
  );
}

export default Header;
