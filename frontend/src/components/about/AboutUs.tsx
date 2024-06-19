'use client';

import { useRouter } from 'next/navigation';

function AboutUs() {
  const router = useRouter();

  const goToHome = () => {
    router.push('/');
  };

  return (
    <>
      <h1 className="title cursor-pointer lg:!text-[50px]" onClick={goToHome}>
        WinfinityArena
      </h1>
      <div className="rounded-md bg-purple-950 p-5 mt-5">
        <p>
          Bienvenue sur <span className="text-simple">WinfinityArena</span>,
          l&apos;univers où la passion des jeux se mêle à l&apos;innovation
          numérique. Créé par{' '}
          <a
            className="text-simple"
            href="https://github.com/LintyDev"
            target="_blank"
          >
            Linty
          </a>
          , étudiant développeur fullstack en quête d&apos;apprentissage et
          d&apos;aventure, WinfinityArena est né de souvenirs d&apos;enfance, de
          compétitions familiales et de créativité débordante.
        </p>
      </div>
    </>
  );
}

export default AboutUs;
