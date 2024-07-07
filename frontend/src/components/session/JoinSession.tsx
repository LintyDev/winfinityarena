'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import axiosClient from '@/lib/axiosClient';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function JoinSession() {
  const auth = useAuth();
  const { users, socket, session } = useSocket();
  const [stateSession, setStateSession] = useState<string>(
    'En attente de joueurs...'
  );

  useEffect(() => {
    if (!auth.user || !auth.user.meta.inGame.length || !session) {
      return;
    }
    const canStartSession = async () => {
      try {
        const res = await axiosClient.post('/game/eventstart', {
          sessionId: session.sessionId,
        });
        if (res.data.success) {
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    if (users.length > 1) {
      const isKingThere = users.filter(
        (u) => u.username === auth.user?.username
      );
      if (isKingThere.length > 0) {
        canStartSession().then((res) => {
          if (res) {
            setStateSession("L'hôte peut désormais lancer la session !");
          }
        });
      } else {
        setStateSession("L'hôte doit rejoindre la session !");
      }
    } else {
      setStateSession('En attente de joueurs...');
    }
  }, [auth.user, session, users]);

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
        {users.map((user, i) => {
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

export default JoinSession;
