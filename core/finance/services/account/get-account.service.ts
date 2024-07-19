import type { Account } from '../../models';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useGetAccount(id: string) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['account', { id }],
    queryFn: () => getAccount(id),
  });
  return query;
}

async function getAccount(id: string): Promise<Account> {
  const res = await client.api.accounts[':id']['$get']({ param: { id } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Error on fetch data');
  }
  const { data } = await res.json();
  return data;
}
