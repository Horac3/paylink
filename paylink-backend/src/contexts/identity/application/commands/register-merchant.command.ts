export class RegisterMerchantCommand {
  constructor(
    readonly email: string,
    readonly businessName: string,
    readonly password: string,
  ) {}
}
