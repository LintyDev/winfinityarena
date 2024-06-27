'use client';

import LoadingView from '@/components/LoadingView';
import ChooseGame from '@/components/session/ChooseGame';
import JoinSession from '@/components/session/JoinSession';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function GameHost() {
  const auth = useAuth();
  const { session, socket } = useSocket();
  const router = useRouter();
  const [gameStatus, setGameStatus] = useState<string>();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setLoad(true);
    if (!auth.user || !auth.user.meta.inGame.length || !socket || !session) {
      console.log('user not found');
      return;
    }
    setGameStatus(auth.user.meta.inGame[0].status);
    setLoad(false);

    socket.on('startSession', async () => {
      try {
        const res = await axiosClient.post('/session/start', {
          sessionId: session.sessionId,
        });
        if (res.data.success) {
          const newStatus: string = res.data.status;
          setGameStatus(newStatus);
          socket.emit('setMobileView', {
            roomId: session.sessionId,
            status: newStatus,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });

    // socket.on('changeView', (gameSt: any) => {
    //   setGameStatus(gameSt);
    // });

    return () => {
      socket.disconnect();
    };
  }, [auth.user, router, socket, session]);

  const renderView = () => {
    if (load) {
      return <LoadingView />;
    }
    switch (gameStatus) {
      case 'IN_PROGRESS':
        return <JoinSession />;
      case 'CHOOSE_GAME':
        return <ChooseGame />;
      default:
        return <JoinSession />;
    }
  };

  return <div className="h-full">{renderView()}</div>;
}

export default GameHost;
