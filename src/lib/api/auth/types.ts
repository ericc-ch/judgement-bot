export interface User {
  id: string;
  email: string;
}

export interface OptionsSignIn {
  body: {
    email: string;
    password: string;
  };
}

export interface ResponseSignIn {
  access_token: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}
