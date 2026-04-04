import { RecipientToken } from '../recipient-token.entity';

export const RECIPIENT_TOKEN_REPOSITORY = 'RECIPIENT_TOKEN_REPOSITORY';

export interface IRecipientTokenRepository {
  save(token: RecipientToken): Promise<void>;
  findById(id: string): Promise<RecipientToken | null>;
  markUsed(id: string): Promise<void>;
}
