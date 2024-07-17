import type { Account } from '../../models';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useGetAccounts() {
  const query = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });
  return query;
}

async function getAccounts(): Promise<Account[]> {
  const res = await client.api.accounts.$get();
  const { data, error } = await res.json();
  if (!res.ok) {
    if (error) throw new Error(error);
    throw new Error('Error on fetch data');
  }
  return data;
}
