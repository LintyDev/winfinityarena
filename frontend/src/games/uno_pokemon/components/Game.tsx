'use client';

import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import UNOPOKEMON from '../scenes/GameScene';

function GameUnoPokemon() {
  const { session, socket } = useSocket();
  const parentEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session || !socket || !parentEl.current) {
      return;
    }
    const sizes = {
      height: document.getElementById('gaming_zone')?.clientHeight ?? '100%',
      width: document.getElementById('gaming_zone')?.clientWidth ?? '100%',
    };

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: parentEl.current,
      width: sizes.width,
      height: sizes.height,
      scene: new UNOPOKEMON(session, socket),
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, [session, socket]);

  return <div id="phaser-container" ref={parentEl}></div>;
}

export default GameUnoPokemon;
