export class ListLinksQuery {
  constructor(
    readonly merchantId: string,
    readonly page: number,
    readonly limit: number,
    readonly status?: string,
  ) {}
}
