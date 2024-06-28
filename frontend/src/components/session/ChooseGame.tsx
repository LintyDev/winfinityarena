import Image from 'next/image';

function ChooseGame() {
  return (
    <div className="flex flex-col items-center h-full bg-[url('/img/background_choose_game.png')] bg-top bg-cover bg-no-repeat bg-fixed">
      <h1 className="title !text-[45px] mb-5">Choisir un jeu</h1>
      <Image
        src={'/game_thumbnails/uno_pokemon.png'}
        alt="thumbnail uno pokemon"
        width={350}
        height={500}
        priority={true}
        className="rounded-2xl border-2"
      />
      <p>Un seul jeu est disponible pour le moment.</p>
    </div>
  );
}

export default ChooseGame;
