import type { Transaction } from '../../models';
import type { UpdateTransactionDto } from '../../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UpdateTransactionDto) => {
      const category = await updateTransaction(id, payload);
      return category;
    },
    onSuccess: () => {
      toast.success('Transaction updated');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Todo: Invalidate summary
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function updateTransaction(id: string, payload: UpdateTransactionDto): Promise<Transaction> {
  const res = await client.api.transactions[':id']['$patch']({ param: { id }, json: payload });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
  const { data } = await res.json();
  return data;
}
