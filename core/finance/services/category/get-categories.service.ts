import type { Category } from '../../models';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useGetCategories() {
  const query = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  return query;
}

async function getCategories(): Promise<Category[]> {
  const res = await client.api.categories.$get();

  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Error on fetch data');
  }
  const { data } = await res.json();
  return data;
}
