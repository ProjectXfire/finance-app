import type { Category } from '../../models';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useGetCategory(id: string) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['category', { id }],
    queryFn: () => getCategory(id),
  });
  return query;
}

async function getCategory(id: string): Promise<Category> {
  const res = await client.api.categories[':id']['$get']({ param: { id } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Error on fetch data');
  }
  const { data } = await res.json();
  return data;
}
