import type { Transaction } from '../../models';
import type { GetTransactionsDto } from '../../dtos';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useGetTransactions() {
  const params = useSearchParams();
  const from = params.get('from');
  const to = params.get('to');
  const accountId = params.get('accountId');
  // Todo: Check params in the query key
  const query = useQuery({
    queryKey: ['transactions', { from, to, accountId }],
    queryFn: () => getTransactions(accountId, from, to),
  });
  return query;
}

async function getTransactions(
  accountId: string | null,
  from: string | null,
  to: string | null
): Promise<Transaction[]> {
  const res = await client.api.transactions.$get({
    query: { from: from ?? '', to: to ?? '', accountId: accountId ?? '' },
  });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Error on fetch data');
  }
  const { data } = await res.json();
  return data;
}
