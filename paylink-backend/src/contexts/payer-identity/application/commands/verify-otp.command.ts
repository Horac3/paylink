export class VerifyOtpCommand {
  constructor(
    readonly payerId: string,
    readonly idToken: string,
  ) {}
}
