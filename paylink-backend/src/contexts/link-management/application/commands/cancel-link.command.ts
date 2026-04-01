export class CancelLinkCommand {
  constructor(
    readonly linkId: string,
    readonly merchantId: string,
  ) {}
}
