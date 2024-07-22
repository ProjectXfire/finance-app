import type { Transaction } from '../../models';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useGetTransaction(id: string) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: () => getTransaction(id),
  });
  return query;
}

async function getTransaction(id: string): Promise<Transaction> {
  const res = await client.api.transactions[':id']['$get']({ param: { id } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Error on fetch data');
  }
  const { data } = await res.json();
  return data;
}
