export class LoginCommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  merchantId: string;
}
