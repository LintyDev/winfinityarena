'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSocketController } from '@/contexts/SocketControllerContext';
import { useEffect, useRef, useState } from 'react';
import { UP_Card } from '../types/gameType';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';

function ControllerUnoPokemon() {
  const { socket, session } = useSocketController();
  const router = useRouter();
  const { user } = useAuth();
  const [hand, setHand] = useState<UP_Card[]>([]);
  const [loadingSocket, setLoadingSocket] = useState<boolean>(true);
  const [gameMessage, setGameMessage] = useState<string>('');
  const pickButton = useRef<HTMLParagraphElement>(null);
  const skipButton = useRef<HTMLParagraphElement>(null);
  const putButton = useRef<HTMLParagraphElement>(null);
  const selectedCardRef = useRef<UP_Card | undefined>(undefined);
  const colorRef = useRef<UP_Card['color'] | undefined>(undefined);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [modalColor, setModalColor] = useState<boolean>(false);
  const [modalUno, setModalUno] = useState<boolean>(false);
  const [unoMsg, setUnoMsg] = useState<string>('');
  const [unoStyle, setUnoStyle] = useState<string>('');
  const [modalEnd, setModalEnd] = useState<boolean>(false);
  const [endMsg, setEndMsg] = useState<string>('');

  const unSelectAllCard = () => {
    const cards = document.getElementsByClassName('deck');
    for (let i = 0; i < cards.length; i++) {
      cards.item(i)?.classList.remove('selected');
    }
  };

  const selectCard = (e: React.MouseEvent<HTMLElement>, h: UP_Card) => {
    unSelectAllCard();
    e.currentTarget.classList.add('selected');
    if (h.type === '+4' || h.type === 'joker') {
      setModalColor(!modalColor);
    }
    selectedCardRef.current = h;
    setGameMessage('Tu as selectionné cette carte : ' + h.name + ' !');
    messageRef.current?.removeAttribute('style');
  };

  const chooseColor = (color: UP_Card['color']) => {
    colorRef.current = color;
    putButton.current?.dispatchEvent(new Event('click'));
    handleCloseModalColor();
  };

  const handleCloseModalColor = () => {
    setModalColor(!modalColor);
    unSelectAllCard();
    selectedCardRef.current = undefined;
  };

  const goToHome = () => {
    router.push('/');
  };

  const handleUnoPokemon = () => {
    const u = unoMsg === 'UNO-POKEMON' ? true : false;
    console.log('jenvoi ', u);
    socket?.emit('UNOPOKEMONTRIGGER', {
      roomId: session?.sessionId,
      uno: u,
    });
    setModalUno(false);
  };

  useEffect(() => {
    if (!socket || !session || !user) {
      return;
    }
    setLoadingSocket(false);

    const handleCardToDeck = ({ card }: { card: UP_Card[] }) => {
      setHand(card);
    };

    const handleSkip = () => {
      socket.emit('skip', {
        roomId: session.sessionId,
        username: user.username,
      });
      offBtn();
    };

    const handlePick = () => {
      socket.emit('pick', {
        roomId: session.sessionId,
        username: user.username,
      });
      offBtn();
    };

    const handlePut = () => {
      if (selectedCardRef.current === undefined) {
        messageRef.current?.setAttribute('style', 'color:red;');
        setGameMessage('Tu dois selectionner une carte !');
        return;
      }
      if (
        (colorRef.current && selectedCardRef.current.type === 'joker') ||
        selectedCardRef.current.type === '+4'
      ) {
        selectedCardRef.current.color = colorRef.current as UP_Card['color'];
      }
      socket.emit('put', {
        roomId: session.sessionId,
        username: user.username,
        card: selectedCardRef.current,
      });
      offBtn();
    };

    const offBtn = () => {
      skipButton.current?.classList.remove('red');
      pickButton.current?.classList.remove('blue');
      putButton.current?.classList.remove('green');

      skipButton.current?.removeEventListener('click', handleSkip);
      pickButton.current?.removeEventListener('click', handlePick);
      putButton.current?.removeEventListener('click', handlePut);
    };

    const handleYourTurnToPlay = () => {
      console.log('my turn to play');
      skipButton.current?.classList.add('red');
      pickButton.current?.classList.add('blue');
      putButton.current?.classList.add('green');

      skipButton.current?.addEventListener('click', handleSkip);
      pickButton.current?.addEventListener('click', handlePick);
      putButton.current?.addEventListener('click', handlePut);

      return () => {
        skipButton.current?.removeEventListener('click', handleSkip);
        pickButton.current?.removeEventListener('click', handlePick);
        putButton.current?.removeEventListener('click', handlePut);
      };
    };

    const handleAfterAction = ({
      action,
      message,
      cards,
    }: {
      action: string;
      message: string;
      cards: UP_Card[];
    }) => {
      messageRef.current?.removeAttribute('style');
      setGameMessage(message);
      switch (action) {
        case 'pick':
          setHand(cards);
          break;
        case 'put':
          setHand(cards);
          selectedCardRef.current = undefined;
          break;
        case 'cannotPlay':
          messageRef.current?.setAttribute('style', 'color:red;');
          handleYourTurnToPlay();
          break;
        default:
          break;
      }
    };

    const UNOPOKEMON = ({ username }: { username: string }) => {
      if (username === user.username) {
        setUnoMsg('UNO-POKEMON');
        setUnoStyle('green');
      } else {
        setUnoMsg('CONTRE UNO-POKEMON');
        setUnoStyle('red');
      }

      setModalUno(true);
      return () => {
        setModalUno(false);
      };
    };

    const endGame = ({ username }: { username: string }) => {
      setEndMsg('Le vainqueur est : ' + username + ' !');
      setModalEnd(true);
    };

    socket.on(`cardToDeck-${user.username}`, handleCardToDeck);
    socket.on(`yourTurnToPlay-${user.username}`, handleYourTurnToPlay);
    socket.on(`afterAction-${user.username}`, handleAfterAction);
    socket.on('UNOPOKEMONCONTROLLER', UNOPOKEMON);
    socket.on('endGameController', endGame);

    setLoadingSocket(true);
    return () => {
      socket.off(`cardToDeck-${user.username}`);
      socket.off(`yourTurnToPlay-${user.username}`);
      socket.off(`afterAction-${user.username}`);
      socket.off('UNOPOKEMONCONTROLLER', UNOPOKEMON);
      socket.off('endGameController', endGame);
      setLoadingSocket(false);
    };
  }, [session, socket, user]);

  useEffect(() => {
    if (!session || !socket || !user) {
      return;
    }
    if (loadingSocket) {
      socket.emit('haveCards', {
        roomId: session.sessionId,
        username: user.username,
      });
    }
  }, [session, socket, user, loadingSocket]);

  useEffect(() => {
    console.log(selectedCardRef.current);
  }, [selectedCardRef]);

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <p className="text-center title">UNO POKEMON</p>
        <div className="h-full flex overflow-hidden gap-3">
          <div className="h-full flex overflow-auto gap-3 w-[80%]">
            {hand.map((h) => {
              return (
                <Image
                  key={h.name}
                  className="w-auto h-[100%] deck"
                  src={'/games/uno_pokemon/cards/' + h.img}
                  alt={'card ' + h.name}
                  width={660}
                  height={920}
                  priority={true}
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    selectCard(event, h);
                  }}
                />
              );
            })}
          </div>
          <div className="flex flex-col w-[20%] gap-3">
            <p className="win-btn" ref={skipButton}>
              Passer
            </p>
            <p className="win-btn" ref={pickButton}>
              Piocher
            </p>
            <p className="win-btn" ref={putButton}>
              Poser
            </p>
            <p ref={messageRef}>{gameMessage}</p>
          </div>
        </div>
      </div>
      <Modal isOpen={modalColor}>
        <div className="flex flex-col items-center">
          <p className="subtitle">Choisir une couleur :</p>
          <div className="flex gap-7 mt-3 mb-10">
            <p className="win-btn blue" onClick={() => chooseColor('blue')}>
              Bleu
            </p>
            <p className="win-btn yellow" onClick={() => chooseColor('yellow')}>
              Jaune
            </p>
            <p className="win-btn red" onClick={() => chooseColor('red')}>
              Rouge
            </p>
            <p className="win-btn green" onClick={() => chooseColor('green')}>
              Vert
            </p>
          </div>
          <p className="win-btn" onClick={handleCloseModalColor}>
            Annuler
          </p>
        </div>
      </Modal>
      <Modal isOpen={modalUno}>
        <div className="flex flex-col items-center">
          <p className="subtitle">UNO POKEMON !!!</p>
          <p className={`win-btn ${unoStyle}`} onClick={handleUnoPokemon}>
            {unoMsg}
          </p>
        </div>
      </Modal>
      <Modal isOpen={modalEnd}>
        <div className="flex flex-col items-center">
          <p className="title">Partie terminé !</p>
          <p className="title">{endMsg}</p>
          <p className="win-btn green" onClick={goToHome}>
            Fin de session
          </p>
        </div>
      </Modal>
    </>
  );
}

export default ControllerUnoPokemon;
