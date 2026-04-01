export class GetLinkQuery {
  constructor(readonly linkId: string) {}
}

export class GetLinkBySlugQuery {
  constructor(readonly slug: string) {}
}
