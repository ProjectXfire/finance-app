export interface Transaction {
  id: string;
  amount: number;
  payee: string;
  notes: string;
  date: string;
  category: string;
  categoryId: string;
  account: string;
  accountId: string;
}
