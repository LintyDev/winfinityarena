'use client';

import { useRouter } from 'next/navigation';

function About() {
  const router = useRouter();

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="text-center mt-5 px-10">
      <h1 className="title cursor-pointer !text-[50px]" onClick={goToHome}>
        WinfinityArena
      </h1>
      <div className="rounded-md bg-purple-950 p-5 mt-5">
        <p>
          Ehh salut ! Moi, c&apos;est <b>Linty</b>, étudiant et développeur
          fullstack. Toujours en quête d&apos;apprentissage et avide de nouveaux
          projets, je vous présente :{' '}
          <span className="text-simple">WinfinityArena</span>.
        </p>
        <p>
          Ce projet est né d&apos;une nostalgie de mon enfance. Dans ma famille,
          nous avons toujours été très compétitifs. Chaque jeu se transformait
          en un véritable championnat, avec des titres en jeu comme{' '}
          <b>&quot;Champion 2012 du UNO&quot;</b>. Nous étions également très
          créatifs, par exemple nous avions des cartes Pokémon et nous avons
          inventé des jeux comme le &quot;Uno Pokémon&quot;. Et oui, je suis
          fier de dire que je suis le dernier champion en titre du Uno Pokémon,
          aha !
        </p>
        <p>
          J&apos;ai voulu recréer notre monde en transformant nos mini-jeux en
          une version jouable en ligne. Je vous souhaite donc la bienvenue dans
          notre univers ! Profitez de l&apos;esprit de compétition et de la joie
          que nous avons ressentis en jouant à ces jeux.
        </p>
      </div>
      <div>
        <p className="subtitle mt-5">ChangeLogs</p>
      </div>
    </div>
  );
}

export default About;
