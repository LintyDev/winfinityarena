export interface gameInfo {
  name: string;
  thumbnail: string;
}

export interface InGameSession {
  id: number;
  sessionId: string;
  status: string;
  game: string | null;
  gameState: object | null;
  createdAt: Date;
  updatedAt: Date;
  accessKey: number;
  users: SessionUser[];
}

export interface SessionUser {
  id: number;
  avatar: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  meta: SessionMeta;
}

export interface SessionMeta {
  pivot_room_id: number;
  pivot_user_id: number;
  pivot_win: boolean;
}

export interface GameState {
  players: {
    username: string;
    hand: UP_Card[];
    avatar: string;
  }[];
  cards: UP_Card[];
  cardsOnTable: UP_Card[];
  activePlayer: number;
}
