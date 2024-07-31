import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useDeleteAccounts() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: string[]) => {
      await deleteAccounts(payload);
      return payload.length;
    },
    onSuccess: (data) => {
      toast.success(data > 1 ? 'Accounts deleted' : 'Account deleted');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function deleteAccounts(payload: string[]): Promise<void> {
  const res = await client.api.accounts['bulk-delete']['$post']({ json: { ids: payload } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
}
