export class RegisterPayerCommand {
  constructor(
    readonly email: string,
    readonly msisdn: string,
  ) {}
}
