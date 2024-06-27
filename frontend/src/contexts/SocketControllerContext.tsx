'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axiosClient from '@/lib/axiosClient';
import { InGame } from '@/types/user';
import { useRouter } from 'next/navigation';

interface SocketControllerContextType {
  king: boolean;
  socket: Socket | null;
  session: InGame | null;
}

export const SocketControllerContext =
  createContext<SocketControllerContextType>({
    king: false,
    socket: null,
    session: null,
  });

export const SocketControllerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, setUpdate } = useAuth();
  const [king, setKing] = useState(false);
  const router = useRouter();
  const [session, setSession] = useState<InGame | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const pauseScreen = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!user || !user.meta.inGame.length) {
      return;
    }

    setSession(user.meta.inGame[0]);

    const newSocket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER ?? 'http://localhost:3333/',
      {
        withCredentials: true,
      }
    );
    setSocket(newSocket);

    const checkKingAndJoinSession = async () => {
      try {
        const res = await axiosClient.get('/session/king');
        setKing(res.data.king);
        newSocket.emit('joinRoomFromMobile', {
          roomId: user.meta.inGame[0].sessionId,
          username: user.username,
          userId: user.id,
          avatar: user.avatar,
        });
      } catch (error) {
        console.log(error);
      }
    };
    checkKingAndJoinSession();

    newSocket.emit(
      'isKingInRoom',
      { roomId: user.meta.inGame[0].sessionId },
      (hostIn: boolean) => {
        if (!hostIn) {
          pauseScreen.current && (pauseScreen.current.style.display = 'flex');
        }
      }
    );

    newSocket.on('hostConnected', () => {
      pauseScreen.current && (pauseScreen.current.style.display = 'none');
    });

    newSocket.on('hostDisconnected', ({ session }: { session: boolean }) => {
      if (session) {
        setUpdate(true);
        router.push('/');
      } else {
        pauseScreen.current && (pauseScreen.current.style.display = 'flex');
      }
      return;
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user, setUpdate, router]);

  return (
    <SocketControllerContext.Provider value={{ king, socket, session }}>
      <div
        className="game-paused flex flex-col items-center justify-center"
        ref={pauseScreen}
      >
        <p className="title !text-[70px]">PAUSE</p>
        <p className="subtitle">En attente de l&apos;hôte...</p>
      </div>
      {children}
    </SocketControllerContext.Provider>
  );
};

export const useSocketController = () => useContext(SocketControllerContext);
