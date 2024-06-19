'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/contexts/AuthContext';

function ModalUsername() {
  const auth = useAuth();
  const [modalUsername, setModalUsername] = useState<boolean>(false);

  const toggleModal = () => {
    setModalUsername(!modalUsername);
    reset();
  };

  const schema = yup.object({
    username: yup
      .string()
      .trim()
      .lowercase()
      .required('Veuillez remplir ce champ.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ username }: { username: string }) => {
    if (username !== auth?.user?.username) {
      try {
        const edit = await auth?.edit({
          id: auth.user?.id as number,
          username,
        });
        if (edit) {
          setModalUsername(!modalUsername);
        } else {
          throw new Error('Error with server');
        }
      } catch (error: any) {
        console.log(error);
        if (error.response?.status === 422) {
          setError('username', {
            message: 'Cet utilisateur est déjà pris',
          });
        } else {
          setError('username', {
            message: 'Une erreur est survenue.',
          });
        }
      }
    } else {
      setError('username', {
        message: "Choisissez un autre nom d'utilisateur.",
      });
    }
  };

  return (
    <>
      <p className="win-btn-small green" onClick={toggleModal}>
        Modifier le nom d&apos;utilisateur
      </p>
      <Modal isOpen={modalUsername}>
        <div>
          <p className="font-upheavtt text-center text-lg">
            Modifier le nom d&apos;utilisateur
          </p>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="rounded text-black p-2 w-80"
              type="text"
              placeholder="Nom d'utilisateur"
              defaultValue={auth?.user?.username}
              {...register('username')}
            />
            <p className="text-red-600 text-center">
              {errors.username?.message}
            </p>
            <p className="win-btn-small" onClick={toggleModal}>
              Fermer
            </p>
            <button className="win-btn-small green">Sauvegarder</button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default ModalUsername;
