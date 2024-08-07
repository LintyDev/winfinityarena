'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import LoadingView from '@/components/LoadingView';
import JoinSessionFromMobile from '@/components/controller/JoinSession';
import { useSocketController } from '@/contexts/SocketControllerContext';
import ChooseGameFromMobile from '@/components/controller/ChooseGame';
import PauseScreen from '@/components/controller/PauseScreen';
import InGameMobile from '@/components/controller/InGame';

function GameController() {
  const auth = useAuth();
  const { king, session, socket, pauseScreen } = useSocketController();
  const [loadMobile, setLoadMobile] = useState(true);
  const [gameStatus, setGameStatus] = useState<string>();

  useEffect(() => {
    setLoadMobile(true);
    if (!auth.user || !socket || !auth.user.meta.inGame.length || !session) {
      console.log(session);
      return;
    }
    setLoadMobile(false);
    setGameStatus(session.status);

    socket.on('changeMobileView', ({ status }: { status: string }) => {
      setGameStatus(status);
    });

    return () => {
      socket.off('changeMobileView');
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
        return <JoinSessionFromMobile />;
      case 'IN_GAME':
        return <InGameMobile />;
      default:
        return <JoinSessionFromMobile />;
    }
  };

  return (
    <div className="h-full">
      <PauseScreen />
      {renderView()}
    </div>
  );
}

export default GameController;
