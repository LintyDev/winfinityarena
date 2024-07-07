import { GameState, InGameSession } from '@/types/game';
import Player from '../scenes/Player';
import { UP_Card, UP_Players } from '../types/gameType';
import { Socket } from 'socket.io-client';
import axiosClient from '@/lib/axiosClient';

export function createPlayers(
  ctx: Phaser.Scene,
  session: InGameSession,
  position: {
    x: number;
    y: number;
  }[],
  width: number,
  height: number
) {
  return session.users.map((u, i) => {
    return new Player(
      ctx,
      {
        username: u.username,
        avatar: `player${i + 1}`,
        hand: [],
        position: position[i],
      },
      width,
      height
    );
  });
}

export function moveCardTo(
  ctx: Phaser.Scene,
  cardImg: Phaser.GameObjects.Image,
  player: Player,
  cardIndex: number,
  card: UP_Card,
  delay?: number
) {
  return new Promise<void>(async (resolve, reject) => {
    ctx.tweens.add({
      targets: cardImg,
      x: player.container.x + player.handContainer.x + (cardIndex - 3) * 20,
      y: player.container.y + player.handContainer.y + 40,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 400,
      delay: delay,
      onComplete: async () => {
        player.addCard(card, cardImg, cardIndex);
        console.log(card);
        resolve();
      },
    });
  });
}

export function playCard(
  ctx: Phaser.Scene,
  cardImg: Phaser.GameObjects.Image,
  width: number,
  height: number
) {
  return new Promise<Phaser.GameObjects.Image>((resolve, reject) => {
    ctx.tweens.add({
      targets: cardImg,
      x: 0.1 * width,
      y: 0.3 * height,
      scaleX: 0.16,
      scaleY: 0.16,
      duration: 400,
      onComplete: () => {
        resolve(cardImg);
      },
    });
  });
}

export async function malusPlusCard(
  ctx: Phaser.Scene,
  plus: number,
  player: Player,
  cards: UP_Card[],
  socket: Socket,
  sessionId: string,
  width: number,
  height: number
) {
  let count = -1;
  const promises: Promise<void>[] = [];
  for (let i = 0; i < plus; i++) {
    const cardImg = ctx.add
      .image(0.6 * width, 0.5 * height, 'backcard')
      .setScale(0.16);

    const card = cards.shift() as UP_Card;

    count = count + 1;
    const promise = moveCardTo(ctx, cardImg, player, i, card, count * 300);
    promises.push(promise);
  }

  await Promise.all(promises).then(() => {
    socket.emit('sendCardToController', {
      roomId: sessionId,
      card: player.hand,
      username: player.username,
    });
  });
}

export function distributeCards(
  ctx: Phaser.Scene,
  players: Player[],
  cards: UP_Card[],
  socket: Socket,
  sessionId: string,
  width: number,
  height: number
) {
  return new Promise<void>(async (resolse, reject) => {
    let count = -1;
    const promises: Promise<void>[] = [];
    for (let i = 0; i < 7; i++) {
      players.forEach(async (p, indexPlayer) => {
        const card = cards.shift();
        if (!card) {
          return;
        }

        const cardImg = ctx.add
          .image(0.6 * width, 0.5 * height, 'backcard')
          .setScale(0.16);
        count = count + 1;
        const promise = moveCardTo(ctx, cardImg, p, i, card, count * 300);
        promises.push(promise);
      });
    }

    await Promise.all(promises).then(() => {
      players.forEach((p) => {
        socket.emit('sendCardToController', {
          roomId: sessionId,
          card: p.hand,
          username: p.username,
        });
      });
      resolse();
    });
  });
}

export function showFirstCard(
  ctx: Phaser.Scene,
  cards: UP_Card[],
  cardsOnTable: UP_Card[],
  width: number,
  height: number
) {
  return new Promise<Phaser.GameObjects.Image | false>((resolve, reject) => {
    const card = cards.shift();
    if (!card) {
      return resolve(false);
    }
    cardsOnTable.push(card);

    let cardName = card.name;

    if (card.type === '+4' || card.type === 'joker') {
      const color = ['blue', 'green', 'yellow', 'red'];
      const random = Math.floor(Math.random() * color.length);
      cardName =
        card.type === '+4'
          ? 'plus4_' + color[random]
          : 'joker_' + color[random];
    }

    console.log('PLAYED CARD NAME : ' + cardName);

    const img = ctx.add
      .image(0.6 * width, 0.5 * height, cardName)
      .setScale(0.16);
    ctx.tweens.add({
      targets: img,
      x: 0.5 * width,
      y: 0.5 * height,
      scale: 0.25,
      duration: 400,
      onComplete: () => {
        resolve(img);
      },
    });
  });
}

export function showFirstCardAfterResume(
  ctx: Phaser.Scene,
  width: number,
  height: number,
  cardName: string
) {
  return new Promise<Phaser.GameObjects.Image>((resolve, reject) => {
    const img = ctx.add
      .image(0.6 * width, 0.5 * height, cardName)
      .setScale(0.16);
    ctx.tweens.add({
      targets: img,
      x: 0.5 * width,
      y: 0.5 * height,
      scale: 0.25,
      duration: 400,
      onComplete: () => {
        resolve(img);
      },
    });
  });
}

export async function saveGameState(
  players: Player[],
  cards: UP_Card[],
  cardsOnTable: UP_Card[],
  sessionId: string,
  activePlayer: number
) {
  const formatedPlayer = players.map((p) => ({
    username: p.username,
    hand: p.hand,
    avatar: p.avatar.texture.key,
  }));
  try {
    const res = await axiosClient.post(
      '/game/set',
      JSON.stringify({
        game: {
          players: formatedPlayer,
          cards: cards,
          cardsOnTable: cardsOnTable,
          activePlayer: activePlayer,
        },
        sessionId: sessionId,
      })
    );
  } catch (error) {
    console.log(error);
  }
  return;
}

export async function getGameState(sessionId: string) {
  try {
    const res = await axiosClient.post('/game/get', { sessionId });
    if (res.data.success && res.data.gameState) {
      const game = res.data.gameState as GameState;
      return game;
    }
  } catch (error) {
    console.log(error);
  }
  return false;
}

export async function setWinner(sessionId: string, username: string) {
  try {
    const res = await axiosClient.post('/game/winner', { sessionId, username });
    if (res.data.success) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
  return false;
}
