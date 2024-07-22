import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useDeleteTransactions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: string[]) => {
      await deleteTransaction(payload);
      return payload.length;
    },
    onSuccess: (data) => {
      toast.success(data > 1 ? 'Transactions deleted' : 'Transaction deleted');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Todo: Invalidate summary
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function deleteTransaction(payload: string[]): Promise<void> {
  const res = await client.api.transactions['bulk-delete']['$post']({ json: { ids: payload } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
}
