import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/shared/interfaces';

export function useDeleteCategories() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: string[]) => {
      await deleteCategories(payload);
      return payload.length;
    },
    onSuccess: (data) => {
      toast.success(data > 1 ? 'Categories deleted' : 'Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return mutation;
}

async function deleteCategories(payload: string[]): Promise<void> {
  const res = await client.api.categories['bulk-delete']['$post']({ json: { ids: payload } });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) throw new Error(error);
    throw new Error('Connection error');
  }
}
