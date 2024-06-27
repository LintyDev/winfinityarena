'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSocketController } from '@/contexts/SocketControllerContext';
import { useEffect, useRef, useState } from 'react';

function JoinSessionFromMobile() {
  const auth = useAuth();
  const { king, session, socket } = useSocketController();
  const btnStart = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!socket || !session || !auth.user) {
      return;
    }

    const canStartSession = () => {
      btnStart.current?.classList.add('green');
      btnStart.current?.addEventListener('click', () => {
        socket.emit('startingSession', {
          roomId: session.sessionId,
        });
      });
    };

    socket.on('canIStartSession', () => {
      canStartSession();
      return;
    });
  }, [auth.user, socket, session]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {king ? (
        <p className="win-btn" ref={btnStart}>
          Lancer la session
        </p>
      ) : (
        <p className="subtitle">En attente de l&apos;hôte...</p>
      )}
    </div>
  );
}

export default JoinSessionFromMobile;
