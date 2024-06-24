'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import IconUser from '@/assets/icons/icon-user.png';
import IconTrophy from '@/assets/icons/icon-trophy.png';
import IconGame from '@/assets/icons/icons-game.png';

function UserCard() {
  const user = useAuth()?.user;

  return (
    <div className="flex items-center">
      <Image
        placeholder="empty"
        src={`/avatars/${user?.avatar ?? 'avatar1'}.png`}
        alt="avatar profile"
        width={125}
        height={125}
        priority={true}
      />
      <div className="px-2">
        <div className="flex gap-1 items-center">
          <Image src={IconUser} alt="icon user" width={32} height={32} />
          <p className="font-upheavtt">: {user?.username}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={IconGame} alt="icon user" width={32} height={32} />
          <p className="font-upheavtt">: {user?.meta.gamePlayed?.total}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={IconTrophy} alt="icon user" width={32} height={32} />
          <p className="font-upheavtt">: {user?.meta.gameWin?.total}</p>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
