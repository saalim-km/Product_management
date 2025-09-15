export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOuput {
  _id: string;
  name: string;
  email: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}