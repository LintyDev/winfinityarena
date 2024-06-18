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

  return (
    <div className="w-full flex justify-between items-center pt-2 pb-[10px] px-[20px] bg-purple-950">
      <Image
        src={logo}
        className="cursor-pointer"
        onClick={() => router.push('/')}
        alt="Logo WinfinityArena"
        width={250}
      />
      <div className="flex justify-between gap-4 items-center">
        <p>Bienvenue, {auth?.user?.username}!</p>
        <p className="win-btn-small blue">Mon profil</p>
        <p className="win-btn-small red" onClick={logout}>
          Déconnexion
        </p>
      </div>
    </div>
  );
}

export default Header;