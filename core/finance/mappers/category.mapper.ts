import type { Category } from '../models';

export function fromDbToCategory(obj: { [key: string]: any }): Category {
  const { id, name, userId, plaidId } = obj;
  const account: Category = { id, name, userId, plaidId };
  return account;
}
