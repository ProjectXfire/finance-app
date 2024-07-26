import type { Account } from '../../models';
import type { UpdateAccountDto } from '../../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useUpdateAccount(id: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UpdateAccountDto) => {
      const account = await updateAccount(id, payload);
      return account;
    },
    onSuccess: () => {
      toast.success('Account updated');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function updateAccount(id: string, payload: UpdateAccountDto): Promise<Account> {
  const res = await client.api.accounts[':id']['$patch']({ param: { id }, json: payload });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
  const { data } = await res.json();
  return data;
}
