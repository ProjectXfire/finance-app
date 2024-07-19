import type { Category } from '../../models';
import type { CreateCategoryDto } from '../../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreateCategoryDto) => {
      const category = await createCategory(payload);
      return category;
    },
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function createCategory(payload: CreateCategoryDto): Promise<Category> {
  const { name } = payload;
  const res = await client.api.categories.$post({ json: { name } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
  const { data } = await res.json();
  return data;
}
