import type { Summary } from '../../models';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useGetSummary() {
  const params = useSearchParams();
  const from = params.get('from');
  const to = params.get('to');
  const accountId = params.get('accountId');
  // Todo: Check params in the query key
  const query = useQuery({
    queryKey: ['summary', { from, to, accountId }],
    queryFn: () => getSummary(accountId, from, to),
  });
  return query;
}

async function getSummary(
  accountId: string | null,
  from: string | null,
  to: string | null
): Promise<Summary> {
  const res = await client.api.summary.$get({
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
