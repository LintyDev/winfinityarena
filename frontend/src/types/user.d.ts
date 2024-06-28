export default interface User {
  id: number;

  avatar: string;

  username: string;

  role: Roles;

  meta: Meta;

  createdAt: string;

  updatedAt: string;
}

export interface UserInput {
  username: string;

  password: string;
}

export interface UserCreateInput extends UserInput {
  confirmPassword: string;
}

export interface UserUpdateInput {
  id: number;

  avatar?: string;

  username?: string;

  password?: string;

  oldPassword?: string;
}

enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

interface Meta {
  gamePlayed: Total;
  gameWin: Total;
  inGame: InGame[];
}

interface Total {
  total: string;
}

export interface InGame {
  id: number;
  sessionId: string;
  status: string;
  game: string | null;
  createdAt: Date;
  updatedAt: Date;
  accessKey: number;
}

export interface SocketUsers {
  username: string;
  avatar: string;
}
