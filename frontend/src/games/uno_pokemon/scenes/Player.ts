import { UP_Card, UP_Players } from '../types/gameType';

class Player {
  container: Phaser.GameObjects.Container;
  handContainer: Phaser.GameObjects.Container;
  avatar: Phaser.GameObjects.Image;
  username: string;
  hand: UP_Card[];
  uno: boolean;
  private ctx: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    user: UP_Players,
    width: number,
    height: number
  ) {
    this.container = scene.add.container(
      user.position.x * width,
      user.position.y * height
    );
    this.ctx = scene;
    this.uno = false;

    this.username = user.username;
    this.avatar = scene.add.image(0, 0, user.avatar).setScale(0.5);
    this.container.add(this.avatar);

    // hand card
    this.handContainer = scene.add.container(0, 30);
    this.container.add(this.handContainer);
    this.hand = user.hand;
  }

  addCard(card: UP_Card, cardImg: Phaser.GameObjects.Image, i: number) {
    this.hand.push(card);
    this.handContainer.add(cardImg);
    cardImg.setPosition((i - 3) * 20, 40).setScale(0.07);
  }
}

export default Player;
