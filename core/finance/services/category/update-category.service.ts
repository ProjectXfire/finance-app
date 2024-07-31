import type { Category } from '../../models';
import type { UpdateCategorytDto } from '../../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UpdateCategorytDto) => {
      const category = await updateCategory(payload);
      return category;
    },
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function updateCategory(payload: UpdateCategorytDto): Promise<Category> {
  const { id, ...rest } = payload;
  const res = await client.api.categories[':id']['$patch']({ param: { id }, json: rest });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
  const { data } = await res.json();
  return data;
}
