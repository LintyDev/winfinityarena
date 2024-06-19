'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserInput } from '@/types/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup
  .object({
    username: yup
      .string()
      .trim()
      .lowercase()
      .required('Veuillez remplir ce champ.'),
    password: yup.string().required('Veuillez remplir ce champ.'),
  })
  .required();

function Login() {
  const auth = useAuth();
  const [displayError, setDisplayError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitLogin = async (data: UserInput) => {
    try {
      await auth?.login(data);
    } catch (error: any) {
      setDisplayError("Nom d'utilisateur/Mot de passe incorrect.");
    }
  };

  return (
    <section className="m-auto text-center flex flex-col justify-center items-center">
      <h1 className="subtitle">Bienvenue sur WinfinityArena</h1>
      <form
        className="max-w-md flex flex-col gap-2.5 p-3 rounded-md bg-purple-950"
        onSubmit={handleSubmit(handleSubmitLogin)}
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
        <button className="flex self-center win-btn green">Connexion</button>
        <p className="text-red-600">{displayError}</p>
      </form>
      <p className="">
        Nouveau ici ?{' '}
        <a href="/auth/register" className="underline">
          Créez un compte maintenant.
        </a>
      </p>
    </section>
  );
}

export default Login;
