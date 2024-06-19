export default interface User {
  id: number;

  avatar: string;

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
