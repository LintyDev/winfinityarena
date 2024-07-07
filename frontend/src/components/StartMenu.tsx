'use client';

import { useAuth } from '@/contexts/AuthContext';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

function StartMenu({ isMobile }: { isMobile: boolean }) {
  const user = useAuth().user;
  const router = useRouter();
  const setUpdate = useAuth().setUpdate;
  const [sessionAccessKey, setSessionAccessKey] = useState<string>();

  const createSession = async () => {
    try {
      const res = await axiosClient.get('/session/create');
      if (res.data.success) {
        setUpdate(true);
        router.push('/session');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinSessionWithCode = async () => {
    try {
      if (!sessionAccessKey) {
        //make an toaster here
        return;
      }
      const res = await axiosClient.post('/session/join', {
        accessKey: sessionAccessKey,
      });
      if (res.data.success) {
        setUpdate(true);
        router.push('/session');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinSession = () => {
    router.push('/session');
  };

  const goToHistory = () => {
    router.push('/history');
  };

  return (
    <div className="flex flex-col gap-4 bg-purple-950 p-5 rounded-md">
      {user?.meta.inGame?.length ? (
        <p className="win-btn green" onClick={joinSession}>
          Rejoindre la session en cours
        </p>
      ) : !isMobile ? (
        <p className="win-btn green" onClick={createSession}>
          Créer une session
        </p>
      ) : (
        <>
          <input
            className="rounded text-black p-2 w-80"
            type="text"
            placeholder="Entrer un code"
            onChange={(e) => {
              setSessionAccessKey(e.target.value);
            }}
          />
          <p className="win-btn green" onClick={joinSessionWithCode}>
            Rejoindre une session
          </p>
        </>
      )}
      <p className="win-btn orange" onClick={goToHistory}>
        Historique
      </p>
    </div>
  );
}

export default StartMenu;
