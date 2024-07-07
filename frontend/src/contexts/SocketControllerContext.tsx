'use client';

import {
  createContext,
  RefObject,
  useContext,
  useEffect,
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
  pauseScreen: RefObject<HTMLDivElement> | null;
}

export const SocketControllerContext =
  createContext<SocketControllerContextType>({
    king: false,
    socket: null,
    session: null,
    pauseScreen: null,
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
    const socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER ?? 'http://localhost:3333/',
      {
        withCredentials: true,
      }
    );
    socket.connect();
    setSocket(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, []);

  useLayoutEffect(() => {
    if (!user || !user.meta.inGame.length || !socket) {
      return;
    }
    setSession(user.meta.inGame[0]);

    const checkKingAndJoinSession = async () => {
      try {
        const res = await axiosClient.get('/session/king');
        setKing(res.data.king);
        socket.emit('joinRoomFromMobile', {
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

    socket.emit(
      'isKingInRoom',
      { roomId: user.meta.inGame[0].sessionId },
      (hostIn: boolean) => {
        if (!hostIn) {
          pauseScreen.current && (pauseScreen.current.style.display = 'flex');
        }
      }
    );

    socket.on('hostConnected', () => {
      pauseScreen.current && (pauseScreen.current.style.display = 'none');
    });

    socket.on('hostDisconnected', ({ session }: { session: boolean }) => {
      if (session) {
        setUpdate(true);
        router.push('/');
      } else {
        pauseScreen.current && (pauseScreen.current.style.display = 'flex');
      }
      return;
    });

    return () => {
      socket.off('hostConnected');
      socket.off('hostDisconnected');
    };
  }, [user, socket, router, setUpdate]);

  return (
    <SocketControllerContext.Provider
      value={{ king, socket, session, pauseScreen }}
    >
      {children}
    </SocketControllerContext.Provider>
  );
};

export const useSocketController = () => useContext(SocketControllerContext);
