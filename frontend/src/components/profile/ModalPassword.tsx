'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

function ModalPassword() {
  const auth = useAuth();
  const [modalPassword, setModalPassword] = useState<boolean>(false);

  const toggleModal = () => {
    setModalPassword(!modalPassword);
    reset();
  };

  const schema = yup.object({
    oldPassword: yup.string().required('Veuillez remplir ce champ.'),
    password: yup
      .string()
      .min(8, 'Caractères minimum: 8.')
      .required('Veuillez remplir ce champ.'),
    confNewPassword: yup
      .string()
      .required('Veuillez remplir ce champ.')
      .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas.'),
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

  const onSubmit = async ({
    oldPassword,
    password,
  }: {
    oldPassword: string;
    password: string;
  }) => {
    try {
      const edit = await auth?.edit({
        id: auth.user?.id as number,
        oldPassword,
        password,
      });
      if (edit) {
        toggleModal();
      } else {
        throw new Error('Error with server');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 400) {
        setError('oldPassword', {
          message: 'Le mot de passe est incorrect',
        });
      } else {
        setError('oldPassword', {
          message: 'Une erreur est survenue.',
        });
      }
    }
  };

  return (
    <>
      <p className="win-btn-small orange" onClick={toggleModal}>
        Modifier le mot de passe
      </p>
      <Modal isOpen={modalPassword}>
        <div>
          <p className="font-upheavtt text-center text-lg">
            Modifier le mot de passe
          </p>
          <form
            className="flex flex-col gap-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="rounded text-black p-2 mb-2 w-80"
              type="password"
              placeholder="Mot de passe actuel"
              {...register('oldPassword')}
            />
            <p className="text-red-600 text-center">
              {errors.oldPassword?.message}
            </p>
            <input
              className="rounded text-black p-2 w-80"
              type="password"
              placeholder="Nouveau mot de passe"
              {...register('password')}
            />
            <p className="text-red-600 text-center">
              {errors.password?.message}
            </p>
            <input
              className="rounded text-black p-2 w-80"
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              {...register('confNewPassword')}
            />
            <p className="text-red-600 text-center">
              {errors.confNewPassword?.message}
            </p>
            <p className="win-btn-small mb-1 mt-2" onClick={toggleModal}>
              Fermer
            </p>
            <button className="win-btn-small green">Sauvegarder</button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default ModalPassword;
