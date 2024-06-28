'use client';

import { useSocketController } from '@/contexts/SocketControllerContext';
import axiosClient from '@/lib/axiosClient';

function ChooseGameFromMobile() {
  const { session } = useSocketController();

  const chooseGame = async () => {
    if (!session) {
      return;
    }
    try {
      const res = await axiosClient.post('/session/choosegame', {
        sessionId: session.sessionId,
        game: 'uno_pokemon',
      });
      if (res.data.success) {
        console.log('Lets start a game !');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <p className="win-btn blue text-[25px]" onClick={chooseGame}>
        Choisir ce jeu
      </p>
    </div>
  );
}

export default ChooseGameFromMobile;
