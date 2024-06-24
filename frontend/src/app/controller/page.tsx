'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

function GameController() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user) {
      if (!auth.user.meta.inGame.length) {
        console.log('user not found');
        router.push('/');
        return;
      }

      const sessionId = auth.user.meta.inGame[0].sessionId;
      const socket = io(`http://localhost:3333/`, {
        withCredentials: true,
      });

      socket.emit('joinRoomFromMobile', {
        roomId: sessionId,
        username: auth.user.username,
        userId: auth.user.id,
        avatar: auth.user.avatar,
      });

      socket.on('hostDisconnected', ({ session }: { session: boolean }) => {
        if (session) {
          auth.setUpdate(true);
          router.push('/');
        }
        return;
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [router, auth]);

  return (
    <div>
      <p>Room joined</p>
      <p>{auth.user?.meta.inGame[0]?.sessionId}</p>
    </div>
  );
}

export default GameController;
