import type { Account } from '../models';

export function fromDbToAccount(data: any): Account {
  const { id, name } = data;
  const account: Account = { id, name };
  return account;
}
