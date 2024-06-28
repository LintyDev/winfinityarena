'use Client';

import { useSocketController } from '@/contexts/SocketControllerContext';

function PauseScreen() {
  const { pauseScreen } = useSocketController();
  return (
    <div
      className="game-paused flex flex-col items-center justify-center"
      ref={pauseScreen}
    >
      <p className="title !text-[70px]">PAUSE</p>
      <p className="subtitle">En attente de l&apos;hôte...</p>
    </div>
  );
}

export default PauseScreen;
