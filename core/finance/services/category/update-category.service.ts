import type { Category } from '../../models';
import type { UpdateCategorytDto } from '../../dtos';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UpdateCategorytDto) => {
      const category = await updateCategory(id, payload);
      return category;
    },
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function updateCategory(id: string, payload: UpdateCategorytDto): Promise<Category> {
  const res = await client.api.categories[':id']['$patch']({ param: { id }, json: payload });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
  const { data } = await res.json();
  return data;
}
