'use client';

import { useAuth } from '@/contexts/AuthContext';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';

function HeaderSession() {
  const auth = useAuth();
  const router = useRouter();

  const rageQuit = async () => {
    try {
      const res = await axiosClient.post('/session/ragequit', {
        sessionId: auth.user?.meta.inGame[0].sessionId,
      });
      if (res.data.success) {
        auth.setUpdate(true);
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-between items-center pt-2 pb-[10px] px-[20px] bg-purple-950">
      <p className="subtitle cursor-pointer">WinfinityArena</p>
      <div className="flex justify-between gap-4 items-center">
        <p className="win-btn-small red" onClick={rageQuit}>
          Quitter la session
        </p>
      </div>
    </div>
  );
}

export default HeaderSession;
