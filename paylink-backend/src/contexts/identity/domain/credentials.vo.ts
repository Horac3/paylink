/**
 * @description Value object wrapping a bcrypt password hash.
 * Never exposes the raw hash outside this VO.
 */
export class Credentials {
  private constructor(private readonly _hash: string) {}

  static fromHash(hash: string): Credentials {
    return new Credentials(hash);
  }

  get hash(): string {
    return this._hash;
  }
}
