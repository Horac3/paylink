export class UpdateFcmTokenCommand {
  constructor(
    readonly payerId: string,
    readonly fcmToken: string,
  ) {}
}
