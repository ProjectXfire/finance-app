import type { Transaction } from '../../models';
import type { CreateTransactionDto } from '../../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertAmountToMiliunits } from '@/shared/utils';
import { client } from '@/shared/interfaces';

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreateTransactionDto) => {
      const transaction = await createTransaction(payload);
      return transaction;
    },
    onSuccess: () => {
      toast.success('Transaction created');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function createTransaction(payload: CreateTransactionDto): Promise<Transaction> {
  const amountConverted = convertAmountToMiliunits(payload.amount);
  const res = await client.api.transactions.$post({
    json: { ...payload, amount: amountConverted },
  });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
  const { data } = await res.json();
  return data;
}
