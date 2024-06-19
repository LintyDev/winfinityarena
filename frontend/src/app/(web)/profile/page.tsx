import ModalAvatar from '@/components/profile/ModalAvatar';
import ModalPassword from '@/components/profile/ModalPassword';
import ModalUsername from '@/components/profile/ModalUsername';
import UserCard from '@/components/profile/UserCard';

function Profil() {
  return (
    <>
      <div className="flex flex-col items-center mt-8">
        <h1 className="title">Mon Profil</h1>
        <div className="p-5 rounded-md bg-purple-950">
          <UserCard />
          <div className="flex flex-col gap-2 mt-4">
            <ModalAvatar />
            <ModalUsername />
            <ModalPassword />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profil;
