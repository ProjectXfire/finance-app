import type { Transaction } from '../models';

export function fromDbToTransaction(obj: { [key: string]: any }): Transaction {
  const { id, amount, notes, payee, date, account, category, accountId, categoryId } = obj;
  const transaction: Transaction = {
    id,
    amount: amount / 1000,
    notes,
    payee,
    date,
    account,
    category,
    accountId,
    categoryId,
  };
  return transaction;
}
