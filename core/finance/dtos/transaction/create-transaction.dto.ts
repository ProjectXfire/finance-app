export interface CreateTransactionDto {
  amount: number;
  payee: string;
  notes?: string;
  date: Date;
  categoryId?: string;
  accountId: string;
}
