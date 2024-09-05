import { GameState, InGameSession } from '@/types/game';
import { UP_Card } from '../types/gameType';
import { cards } from '../data/gameData';
import Player from './Player';
import { Socket } from 'socket.io-client';
import {
  createPlayers,
  distributeCards,
  getGameState,
  malusPlusCard,
  moveCardTo,
  playCard,
  saveGameState,
  setWinner,
  showFirstCard,
  showFirstCardAfterResume,
} from '../utils/gameFunction';

class UNOPOKEMON extends Phaser.Scene {
  private players: Player[] = [];
  private session: InGameSession;
  private socket: Socket;
  private cards: UP_Card[];
  private cardsOnTable: UP_Card[] = [];
  private playedCard: false | Phaser.GameObjects.Image = false;
  private playersPosition = [
    { x: 0.4, y: 0.17 },
    { x: 0.6, y: 0.17 },
    { x: 0.72, y: 0.5 },
    { x: 0.4, y: 0.77 },
    { x: 0.6, y: 0.77 },
    { x: 0.27, y: 0.5 },
  ];
  private deckPosition = { x: 0.6, y: 0.5 };
  private activePlayer: number = 0;
  private textState: false | Phaser.GameObjects.Text = false;
  private reverseGame: boolean = false;
  private tempLastCard: string = 'none';

  constructor(session: InGameSession, socket: Socket) {
    super({ key: 'UNOPOKEMON' });
    this.session = session;
    this.socket = socket;
    this.cards = this.shuffle([...cards]);
  }

  preload() {
    // load bg
    this.load.image('bg', 'games/uno_pokemon/background.png');
    // load avatars
    this.session.users.forEach((p, i) => {
      this.load.image(`player${i + 1}`, '/avatars/' + p.avatar + '.png');
    });
    // load cards
    this.load.image('backcard', 'games/uno_pokemon/cards/backcard.png');
    this.load.image('joker', 'games/uno_pokemon/cards/joker.png');
    this.load.image('joker_blue', 'games/uno_pokemon/cards/joker_blue.png');
    this.load.image('joker_green', 'games/uno_pokemon/cards/joker_green.png');
    this.load.image('joker_red', 'games/uno_pokemon/cards/joker_red.png');
    this.load.image('joker_yellow', 'games/uno_pokemon/cards/joker_yellow.png');
    this.load.image('plus4', 'games/uno_pokemon/cards/plus4.png');
    this.load.image('plus4_blue', 'games/uno_pokemon/cards/plus4_blue.png');
    this.load.image('plus4_green', 'games/uno_pokemon/cards/plus4_green.png');
    this.load.image('plus4_red', 'games/uno_pokemon/cards/plus4_red.png');
    this.load.image('plus4_yellow', 'games/uno_pokemon/cards/plus4_yellow.png');
    const loadCard = cards.filter((c) => c.type !== '+4' && c.type !== 'joker');
    loadCard.forEach((c) => {
      this.load.image(c.name, '/games/uno_pokemon/cards/' + c.img);
    });
  }

  async create() {
    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;
    // console.log(this.cards);

    // Create base game (background, players, deck)
    this.createBackground();
    this.createDeck(width, height);
    this.players = createPlayers(
      this,
      this.session,
      this.playersPosition,
      width,
      height
    );
    this.textState = this.add
      .text(0.5 * width, 0.9 * height, 'Création de la partie...')
      .setOrigin(0.5, 0.5)
      .setFontSize(25);

    // TWO STEP IF DATA => RESUME GAME ELSE IF NOT DATA => NEW GAME
    const gameState = await getGameState(this.session.sessionId);
    if (gameState) {
      console.log('RESUME GAME');
      this.playedCard = await this.resumeGame(gameState, width, height);
    } else {
      console.log('NEW GAME');
      this.playedCard = await this.newGame(width, height);
    }

    this.loadSocketEvent();
    console.log('now we can start the game..', this.playedCard);
    this.loadEventGame(width, height);
    this.startTurn();
  }

  update(time: number, delta: number): void {}

  createBackground() {
    const bg = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'bg'
    );
    const scaleBg = Math.max(this.cameras.main.height / bg.height);
    bg.setScale(scaleBg).setScrollFactor(0);
  }

  createDeck(width: number, height: number) {
    this.add
      .image(
        this.deckPosition.x * width,
        this.deckPosition.y * height,
        'backcard'
      )
      .setScale(0.16);
  }

  shuffle(cards: UP_Card[]) {
    return cards.sort(() => Math.random() - 0.5);
  }

  loadSocketEvent() {
    this.socket.on(
      'sendCardsToPlayer',
      ({ username }: { username: string }) => {
        const player = this.players.find((p) => p.username === username);
        const activePlayer = this.players[this.activePlayer];
        if (player) {
          this.socket.emit('sendCardToController', {
            roomId: this.session.sessionId,
            card: player.hand,
            username: player.username,
          });
        }
        if (player && player.username === activePlayer.username) {
          this.socket.emit('yourTurnToPlay', {
            roomId: this.session.sessionId,
            username: player.username,
          });
        }
      }
    );
  }

  async newGame(width: number, height: number) {
    await distributeCards(
      this,
      this.players,
      this.cards,
      this.socket,
      this.session.sessionId,
      width,
      height
    );

    const playedCard = await showFirstCard(
      this,
      this.cards,
      this.cardsOnTable,
      width,
      height
    );
    if (playedCard) {
      await saveGameState(
        this.players,
        this.cards,
        this.cardsOnTable,
        this.session.sessionId,
        this.activePlayer
      );
      return playedCard;
    } else {
      this.game.destroy(true);
    }
    return false;
  }

  async resumeGame(gameState: GameState, width: number, height: number) {
    gameState.players.forEach((p) => {
      const player = this.players.find((tp) => tp.username === p.username);
      p.hand.forEach((c, i) => {
        const img = this.add
          .image(0.6 * width, 0.5 * height, 'backcard')
          .setScale(0.16);
        player?.addCard(c, img, i);
      });
      this.socket.emit('sendCardToController', {
        roomId: this.session.sessionId,
        card: p.hand,
        username: p.username,
      });
    });

    this.cards = gameState.cards;
    this.cardsOnTable = gameState.cardsOnTable;
    this.activePlayer = gameState.activePlayer;

    const lastCard = this.cardsOnTable[this.cardsOnTable.length - 1];
    let cardName = lastCard.name;

    if (lastCard.type === '+4' || lastCard.type === 'joker') {
      cardName = lastCard.type === '+4' ? 'plus4' : 'joker';
      if (lastCard.color !== 'all') {
        cardName =
          lastCard.type === '+4'
            ? 'plus4_' + lastCard.color
            : 'joker_' + lastCard.color;
      }
    }
    console.log('LAST PLAYED CARD NAME : ' + cardName);

    const img = await showFirstCardAfterResume(this, width, height, cardName);
    return img;
  }

  resetDeck(returnCard: boolean) {
    const lastCard = this.cardsOnTable.pop() as UP_Card;
    this.cards = this.shuffle([...this.cardsOnTable]);
    this.cardsOnTable = [];
    this.cardsOnTable.push(lastCard);
    if (returnCard) {
      return this.cards.shift() as UP_Card;
    }
    return true;
  }

  loadEventGame(width: number, height: number) {
    this.socket.on(
      'playerWantSkip',
      async ({ username }: { username: string }) => {
        const player = this.players[this.activePlayer];
        if (player.username !== username) {
          return;
        }

        this.socket.emit('afterAction', {
          roomId: this.session.sessionId,
          username: player.username,
          action: 'skip',
          message: 'Tu viens de passer ton tour !',
          cards: null,
        });

        this.nextPlayer();
        return;
      }
    );

    this.socket.on(
      'playerWantPick',
      async ({ username }: { username: string }) => {
        const player = this.players[this.activePlayer];
        player.uno = false;
        if (player.username !== username) {
          return;
        }

        let card = this.cards.shift();
        if (!card) {
          card = this.resetDeck(true) as UP_Card;
        }

        const cardImg = this.add
          .image(0.6 * width, 0.5 * height, 'backcard')
          .setScale(0.16);
        await moveCardTo(this, cardImg, player, player.hand.length, card);

        this.socket.emit('afterAction', {
          roomId: this.session.sessionId,
          username: player.username,
          action: 'pick',
          message: 'Tu viens de piocher cette carte : ' + card.name + ' !',
          cards: player.hand,
        });

        this.nextPlayer();
        return;
      }
    );

    this.socket.on(
      'playerPutCard',
      async ({ username, card }: { username: string; card: UP_Card }) => {
        const player = this.players[this.activePlayer];
        if (player.username !== username) {
          return;
        }

        const lastCard = this.cardsOnTable[this.cardsOnTable.length - 1];
        const realCardIndex = player.hand.findIndex(
          (c) => c.name === card.name
        );
        if (realCardIndex === -1) {
          this.nextPlayer();
          return;
        }

        // check card
        const check = this.checkCard(lastCard, card);
        if (!check) {
          this.socket.emit('afterAction', {
            roomId: this.session.sessionId,
            username: player.username,
            action: 'cannotPlay',
            message: 'Tu ne peux pas jouer cette carte :' + card.name + ' !',
            cards: null,
          });
          return;
        }

        const [realCard] = player.hand.splice(realCardIndex, 1);
        this.cardsOnTable.push(realCard);

        const cardImg = player.handContainer.getAll();
        const img = await playCard(
          this,
          cardImg[0] as Phaser.GameObjects.Image,
          width,
          height
        );

        let cardName = card.name;
        if (card.type === '+4' || card.type === 'joker') {
          cardName =
            card.type === '+4' ? 'plus4_' + card.color : 'joker_' + card.color;
          realCard.color = card.color;
        }

        this.playedCard && this.playedCard.setTexture(cardName);
        img.destroy();

        this.socket.emit('afterAction', {
          roomId: this.session.sessionId,
          username: player.username,
          action: 'put',
          message: 'Tu viens de poser cette carte : ' + cardName + ' !',
          cards: player.hand,
        });

        this.nextPlayer();
        return;
      }
    );
  }

  loadEventUnoPokemon() {
    this.socket.on('UNOPOKEMONHOST', async ({ uno }: { uno: boolean }) => {
      this.socket.off('UNOPOKEMONHOST');
      console.log('je recois', uno);
      const player = this.players[this.activePlayer];
      if (!uno) {
        const width = this.sys.game.config.width as number;
        const height = this.sys.game.config.height as number;
        await malusPlusCard(
          this,
          2,
          player,
          this.cards,
          this.socket,
          this.session.sessionId,
          width,
          height
        );
      } else {
        player.uno = true;
      }

      this.nextPlayer();
    });
  }

  startTurn() {
    const player = this.players[this.activePlayer];
    const lastCard = this.cardsOnTable[this.cardsOnTable.length - 1];
    console.log("C'est à " + player.username + ' de jouer !', lastCard);
    this.textState &&
      this.textState.setText(
        player.username.toLocaleUpperCase() + " c'est ton tour de jouer !"
      );

    this.socket.emit('yourTurnToPlay', {
      roomId: this.session.sessionId,
      username: player.username,
    });
  }

  async nextPlayer() {
    const lastCard = this.cardsOnTable[this.cardsOnTable.length - 1];
    const isWinner = await this.isUnoOrWinner();
    if (isWinner) {
      return;
    }
    this.activePlayer = this.nextPlayerIndex(1);
    if (this.cards.length < 4) {
      this.resetDeck(false);
    }

    if (this.tempLastCard !== lastCard.name) {
      await this.giveMalusToPlayer();
      this.tempLastCard = lastCard.name;
    }

    await this.saveGameStateFromScene();
    this.startTurn();
  }

  async giveMalusToPlayer() {
    const player = this.players[this.activePlayer];
    const lastCard = this.cardsOnTable[this.cardsOnTable.length - 1];
    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;

    switch (lastCard.type) {
      case 'normal':
      case 'joker':
      default:
        break;
      case 'block':
        this.activePlayer = this.nextPlayerIndex(1);
        break;
      case 'sens':
        this.reverseGame = !this.reverseGame;
        this.activePlayer = this.nextPlayerIndex(2);
        break;
      case '+4':
        await malusPlusCard(
          this,
          4,
          player,
          this.cards,
          this.socket,
          this.session.sessionId,
          width,
          height
        );
        break;
      case '+2':
        await malusPlusCard(
          this,
          2,
          player,
          this.cards,
          this.socket,
          this.session.sessionId,
          width,
          height
        );
        break;
    }
  }

  async isUnoOrWinner() {
    const player = this.players[this.activePlayer];
    if (player.hand.length === 1 && !player.uno) {
      this.loadEventUnoPokemon();
      // emit UNO BUTTON IN MODAL
      this.socket.emit('UNOPOKEMON', {
        roomId: this.session.sessionId,
        username: player.username,
      });
      return true;
    } else if (player.hand.length === 0) {
      // WINNER END OF GAME
      const winner = await setWinner(this.session.sessionId, player.username);
      if (winner) {
        this.socket.emit('endGame', {
          roomId: this.session.sessionId,
          username: player.username,
        });
        window.location.replace('/');
        return true;
      }
    }
    return false;
  }

  nextPlayerIndex(n: number) {
    if (this.reverseGame) {
      return (
        (this.activePlayer - n + this.players.length) % this.players.length
      );
    } else {
      return (this.activePlayer + n) % this.players.length;
    }
  }

  async saveGameStateFromScene() {
    await saveGameState(
      this.players,
      this.cards,
      this.cardsOnTable,
      this.session.sessionId,
      this.activePlayer
    );
  }

  checkCard(currentCard: UP_Card, cartToPlay: UP_Card) {
    const { name, type, color, img, number } = currentCard;
    switch (cartToPlay.type) {
      case 'normal':
        if (cartToPlay.number === number || cartToPlay.color === color) {
          return true;
        }
        return false;
      case 'sens':
      case 'block':
      case '+2':
        if (cartToPlay.color === color || cartToPlay.type === type) {
          return true;
        }
        return false;
      case '+4':
      case 'joker':
        return true;
      default:
        return false;
    }
  }
}

export default UNOPOKEMON;
