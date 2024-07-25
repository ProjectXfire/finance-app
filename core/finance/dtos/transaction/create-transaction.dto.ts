export interface CreateTransactionDto {
  amount: number;
  payee: string;
  accountId: string;
  notes: string;
  date: Date;
  categoryId?: string | null;
}
