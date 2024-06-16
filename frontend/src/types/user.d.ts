export default interface User {
  id: number;

  username: string;

  role: Roles;

  gameWin: number;

  gamePlayed: number;

  createdAt: string;

  updatedAt: string;
}

export interface UserInput {
  username: string;

  password: string;
}

enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
