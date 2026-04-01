export class FailRefundCommand {
  constructor(
    readonly externalRef: string,
    readonly reason: string,
  ) {}
}
