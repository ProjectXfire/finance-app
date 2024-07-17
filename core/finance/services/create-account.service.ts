import type { Account } from '../models';
import type { CreateAccountDto } from '../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreateAccountDto) => {
      const account = await createAccount(payload);
      return account;
    },
    onSuccess: () => {
      toast.success('Account created');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function createAccount(payload: CreateAccountDto): Promise<Account> {
  const { name } = payload;
  const res = await client.api.accounts.$post({ json: { name } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
  const { data } = await res.json();
  return data;
}
