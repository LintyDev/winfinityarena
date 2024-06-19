'use client';

import { useEffect, useState } from 'react';
import Modal from '../Modal';
import { useAuth } from '@/contexts/AuthContext';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import avatars from '@/lib/avatars';
import Image from 'next/image';

const responsive = {
  desktop: {
    breakpoint: { max: 4000, min: 0 },
    items: 1,
  },
};

function ModalAvatar() {
  const [carouselRef, setCarouselRef] = useState<Carousel | null>(null);
  const auth = useAuth();
  const [modalAvatar, setModalAvatar] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>('avatar1');
  const [error, setError] = useState<string | null>(null);

  const toggleModal = () => {
    setModalAvatar(!modalAvatar);
  };

  const onSave = async () => {
    try {
      const edit = await auth?.edit({
        id: auth.user?.id as number,
        avatar,
      });
      if (edit) {
        toggleModal();
      } else {
        throw new Error('Error with server');
      }
    } catch (error: any) {
      console.log(error);
      setError('Une erreur est survenue.');
    }
  };

  useEffect(() => {
    const setupAvatar = () => {
      const avatarObj = avatars.find((a) => a.name === auth?.user?.avatar);
      carouselRef?.goToSlide(avatarObj?.id ? avatarObj.id - 1 : 0);
    };

    setupAvatar();
  }, [auth?.user?.avatar, carouselRef]);

  return (
    <>
      <p className="win-btn-small blue" onClick={toggleModal}>
        Modifier l&apos;avatar
      </p>
      <Modal isOpen={modalAvatar}>
        <p className="font-upheavtt text-center text-lg">
          Modifier l&apos;avatar
        </p>
        <div className="flex flex-col gap-2">
          <Carousel
            ref={(e) => {
              setCarouselRef(e);
            }}
            responsive={responsive}
            className="w-[225px]"
            afterChange={(_, _ref) => {
              setAvatar(`avatar${_ref.currentSlide + 1}`);
            }}
          >
            {avatars.map((a) => {
              return (
                <div className="flex justify-center w-[225px]" key={a.id}>
                  <Image
                    src={a.path}
                    alt={a.name}
                    priority={true}
                    width={125}
                    height={125}
                  />
                </div>
              );
            })}
          </Carousel>
          <p className="text-red-600 text-center">{error}</p>
          <p className="win-btn-small mt-2" onClick={toggleModal}>
            Fermer
          </p>
          <p className="win-btn-small green" onClick={onSave}>
            Sauvegarder
          </p>
        </div>
      </Modal>
    </>
  );
}

export default ModalAvatar;
