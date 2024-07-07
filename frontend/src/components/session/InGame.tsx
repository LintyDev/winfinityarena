'use client';

import { useSocket } from '@/contexts/SocketContext';
import GameUnoPokemon from '@/games/uno_pokemon/components/Game';

function InGame() {
  const { session } = useSocket();

  return <GameUnoPokemon />;
}

export default InGame;
