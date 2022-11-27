export interface ILoginResult {
  id: string;
  name: string;
  email: string;
  error: boolean;
  avatarUrl?: string | null;
  token: string;
}

export enum LoginPageMode {
  initial = '0',
  sigin = '1',
  signup = '2'
}
