export interface CreateTransactionDto {
  amount: number;
  payee: string;
  notes: string;
  date: Date;
  accountId: string;
  categoryId?: string | null;
}
