'use client';

import { useSocket } from '@/contexts/SocketContext';

function InGame() {
  // console.log(game);
  const { session } = useSocket();
  return (
    <div>
      <p>in game {session?.game as string}</p>
    </div>
  );
}

export default InGame;
