'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserCreateInput, UserInput } from '@/types/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup
  .object({
    username: yup
      .string()
      .min(3, 'Caractères minimum: 3.')
      .trim()
      .lowercase()
      .required('Veuillez remplir ce champ.'),
    password: yup
      .string()
      .min(8, 'Caractères minimum: 8.')
      .required('Veuillez remplir ce champ.'),
    confirmPassword: yup
      .string()
      .required('Veuillez remplir ce champ.')
      .oneOf([yup.ref('password')], 'Les mot de passe ne correspondent pas.'),
  })
  .required();

function Register() {
  const auth = useAuth();
  const [displayError, setDisplayError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: UserCreateInput) => {
    try {
      await auth?.register({
        username: data.username,
        password: data.password,
      });
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 422) {
        setDisplayError("Nom d'utilisateur déjà pris!");
      } else {
        setDisplayError('Une erreur est survenue!');
      }
    }
  };

  return (
    <section className="m-auto text-center flex flex-col justify-center items-center">
      <h1>Bienvenue sur WinfinityArena</h1>
      <form
        className="max-w-md flex flex-col gap-2.5 p-3 rounded-md bg-purple-950"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="rounded text-black p-2 w-80"
          type="text"
          placeholder="Nom d'utilisateur"
          {...register('username')}
        />
        <p className="text-red-600">{errors.username?.message}</p>
        <input
          className="rounded text-black p-2 w-80"
          type="password"
          placeholder="Mot de passe"
          {...register('password')}
        />
        <p className="text-red-600">{errors.password?.message}</p>
        <input
          className="rounded text-black p-2 w-80"
          type="password"
          placeholder="Confirmer le mot de passe"
          {...register('confirmPassword')}
        />
        <p className="text-red-600">{errors.confirmPassword?.message}</p>
        <button className="flex self-center win-btn green">Inscription</button>
        <p className="text-red-600">{displayError}</p>
      </form>
      <p className="cursor-pointer ">
        Déjà un compte ?{' '}
        <a href="/auth/login" className="underline">
          Se connecter.
        </a>
      </p>
    </section>
  );
}

export default Register;
