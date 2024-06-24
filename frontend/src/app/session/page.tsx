'use client';

import { useAuth } from '@/contexts/AuthContext';
import axiosClient from '@/lib/axiosClient';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function GameHost() {
  const auth = useAuth();
  const router = useRouter();
  const [stateSession, setStateSession] = useState<string>(
    'En attente de joueurs...'
  );
  const [userInSession, setUserInSession] = useState<
    { username: string; avatar: string }[]
  >([]);

  useEffect(() => {
    if (auth.user) {
      if (!auth.user.meta.inGame.length) {
        console.log('user not found');
        router.push('/');
        return;
      }
      const sessionId = auth.user.meta.inGame[0].sessionId;
      const socket = io(`http://localhost:3333/`, {
        withCredentials: true,
      });

      socket.emit(
        'joinRoomFromHost',
        {
          roomId: sessionId,
          username: auth.user.username,
          userId: auth.user.id,
          host: true,
        },
        (res: any) => {
          console.log(res);
          setUserInSession(res.users);
        }
      );

      socket.on(
        'userConnected',
        ({ users }: { users: { username: string; avatar: string }[] }) => {
          console.log('connected', users);
          setUserInSession(users);
        }
      );

      socket.on(
        'userDisconnected',
        ({ users }: { users: { username: string; avatar: string }[] }) => {
          console.log('disconnected', users);
          setUserInSession(users);
        }
      );

      return () => {
        socket.disconnect();
      };
    }
  }, [auth.user, router]);

  useEffect(() => {
    if (auth.user && userInSession.length > 1) {
      const isKingThere = userInSession.filter(
        (u) => u.username === auth.user?.username
      );
      isKingThere
        ? setStateSession("L'hôte peut désormais lancer la session !")
        : setStateSession("L'hôte doit rejoindre la session !");
    } else {
      setStateSession('En attente de joueurs...');
    }
  }, [auth.user, userInSession]);

  return (
    <div className="flex flex-col items-center h-full bg-[url('/img/background_session.png')] bg-top bg-cover bg-no-repeat bg-fixed">
      <div></div>
      <h1 className="title !text-[45px] mb-5">Rejoindre la session</h1>
      <div className="text-center">
        <p className="subtitle !text-[30px] mb-1">Code :</p>
        <p className="bg-black bg-opacity-75 rounded-lg p-4 text-xl">
          {auth.user?.meta.inGame[0]?.accessKey}
        </p>
      </div>
      <div className="mt-10 flex h-[155px]">
        {userInSession.map((user, i) => {
          return (
            <div key={i} className="text-center subtitle">
              <p>
                {user.username}{' '}
                <span>{user.username === auth.user?.username && '(Hôte)'}</span>
              </p>
              <Image
                src={`/avatars/${user.avatar}.png`}
                alt="placeholder avatar"
                width={125}
                height={125}
                priority={true}
              />
            </div>
          );
        })}
      </div>
      <p>{stateSession}</p>
    </div>
  );
}

export default GameHost;
