'use client';

import Phaser from 'phaser';
import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import UNOPOKEMON from '../scenes/GameScene';

function GameUnoPokemon() {
  const { session, socket } = useSocket();

  useEffect(() => {
    if (!session || !socket) {
      return;
    }
    const sizes = {
      height: document.getElementById('gaming_zone')?.clientHeight ?? '100%',
      width: document.getElementById('gaming_zone')?.clientWidth ?? '100%',
    };

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: sizes.width,
      height: sizes.height,
      scene: new UNOPOKEMON(session, socket),
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, [session, socket]);

  return <div id="phaser-container"></div>;
}

export default GameUnoPokemon;
