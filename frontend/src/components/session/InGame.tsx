'use client';

import { useSocket } from '@/contexts/SocketContext';

function InGame({ game }: { game: string }) {
  const { session } = useSocket();
  return (
    <div>
      <p>in game {game ?? session?.game ?? 'dd'}</p>
    </div>
  );
}

export default InGame;
