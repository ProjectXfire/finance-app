import type { CreateTransactionDto } from '../../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useCreateTransactions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreateTransactionDto[]) => {
      await createTransactions(payload);
      return payload.length;
    },
    onSuccess: (data) => {
      toast.success(data > 1 ? 'Transactions created' : 'Transaction created');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Todo: Invalidate summary
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function createTransactions(payload: CreateTransactionDto[]): Promise<void> {
  const res = await client.api.transactions['bulk-create']['$post']({ json: payload });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
}
