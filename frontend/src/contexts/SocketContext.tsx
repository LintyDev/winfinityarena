'use client';

import { InGame, SocketUsers } from '@/types/user';
import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  session: InGame | null;
  users: SocketUsers[];
}

export const SocketContext = createContext<SocketContextType>({
  users: [],
  session: null,
  socket: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<SocketUsers[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [session, setSession] = useState<InGame | null>(null);

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

    newSocket.emit(
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

    newSocket.on(
      'userConnected',
      ({ users }: { users: { username: string; avatar: string }[] }) => {
        // for debug
        // console.log('connected', users);
        setUsers(users);
      }
    );

    newSocket.on(
      'userDisconnected',
      ({ users }: { users: { username: string; avatar: string }[] }) => {
        // for debug
        // console.log('disconnected', users);
        setUsers(users);
      }
    );
  }, [user]);

  return (
    <SocketContext.Provider value={{ users, socket, session }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
