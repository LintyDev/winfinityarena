'use client';

import { InGame, SocketUsers } from '@/types/user';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axiosClient from '@/lib/axiosClient';
import { InGameSession } from '@/types/game';

interface SocketContextType {
  socket: Socket | null;
  session: InGameSession | null;
  users: SocketUsers[];
  setGetSession: Dispatch<SetStateAction<boolean>>;
}

export const SocketContext = createContext<SocketContextType>({
  users: [],
  session: null,
  socket: null,
  setGetSession: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<SocketUsers[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [session, setSession] = useState<InGameSession | null>(null);
  const [getSession, setGetSession] = useState(true);

  useLayoutEffect(() => {
    setGetSession(false);
    const getSession = async () => {
      if (user) {
        try {
          const res = await axiosClient.post(
            '/session/room',
            JSON.stringify({ sessionId: user.meta.inGame[0].sessionId })
          );
          if (res.data.success) {
            setSession(res.data.session);
          }
        } catch (error) {
          // console.log(error);
        }
      }
    };

    getSession();
  }, [getSession, user]);

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
    if (!socket || !user || !user.meta.inGame.length) {
      return;
    }

    socket.emit(
      'joinRoomFromHost',
      {
        roomId: user.meta.inGame[0].sessionId,
        username: user.username,
        userId: user.id,
        host: true,
      },
      async (res: any) => {
        if (res) {
          setUsers(res.users);
        }
      }
    );

    socket.on(
      'userConnected',
      ({ users }: { users: { username: string; avatar: string }[] }) => {
        setUsers(users);
      }
    );

    socket.on(
      'userDisconnected',
      ({ users }: { users: { username: string; avatar: string }[] }) => {
        setUsers(users);
      }
    );

    return () => {
      socket.off('userConnected');
      socket.off('userDisconnected');
    };
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ users, socket, session, setGetSession }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
