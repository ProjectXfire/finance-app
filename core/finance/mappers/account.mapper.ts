import type { Account } from '../models';

export function fromDbToAccount(obj: { [key: string]: any }): Account {
  const { id, name, userId, plaidId } = obj;
  const account: Account = { id, name, userId, plaidId };
  return account;
}
