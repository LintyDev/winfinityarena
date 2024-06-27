'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import LoadingView from '@/components/LoadingView';
import JoinSessionFromMobile from '@/components/controller/JoinSession';
import { useSocketController } from '@/contexts/SocketControllerContext';
import ChooseGameFromMobile from '@/components/controller/ChooseGame';

function GameController() {
  const auth = useAuth();
  const { king, session, socket } = useSocketController();
  const [loadMobile, setLoadMobile] = useState(true);
  const [gameStatus, setGameStatus] = useState<string>();

  useEffect(() => {
    setLoadMobile(true);
    if (!auth.user || !socket || !auth.user.meta.inGame.length || !session) {
      return;
    }
    setLoadMobile(false);
    setGameStatus(session.status);

    socket.on('changeMobileView', ({ status }: { status: string }) => {
      setGameStatus(status);
    });

    return () => {
      socket.disconnect();
    };
  }, [auth.user, socket, session]);

  const renderView = () => {
    if (loadMobile) {
      return <LoadingView />;
    }
    switch (gameStatus) {
      case 'IN_PROGRESS':
        return <JoinSessionFromMobile />;
      case 'CHOOSE_GAME':
        if (king) {
          return <ChooseGameFromMobile />;
        }
      default:
        return <JoinSessionFromMobile />;
    }
  };

  return <div className="h-full">{renderView()}</div>;
}

export default GameController;
