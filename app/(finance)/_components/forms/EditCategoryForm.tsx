'use client';

import type { Category } from '@/core/finance/models';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useCustomDialog } from '@/shared/states';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCategorySchema } from '@/core/finance/schemas';
import { useFinanceSheet } from '../../_states';
import { useDeleteCategories, useUpdateCategory } from '@/core/finance/services';
import styles from './Form.module.css';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components';
import { Trash } from 'lucide-react';
import { ConfirmDelete } from '..';

interface Props {
  category: Category;
}

const formSchema = insertCategorySchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

function EditCategoryForm({ category }: Props): JSX.Element {
  const { id, name } = category;

  const { mutate: mutateDelete } = useDeleteCategories();
  const { mutate, isPending } = useUpdateCategory(id);

  const closeAccountSheet = useFinanceSheet((s) => s.close);
  const setComponent = useCustomDialog((s) => s.setComponent);

  const openDialog = useCustomDialog((s) => s.open);
  const closeDialog = useCustomDialog((s) => s.close);
  const endLoadingDialog = useCustomDialog((s) => s.endLoading);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name },
  });

  const handleSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        closeAccountSheet();
      },
    });
  };

  const handleDelete = () => {
    openDialog();
    setComponent(
      <ConfirmDelete
        onDelete={() => {
          mutateDelete([id], {
            onSettled: () => {
              closeDialog();
              closeAccountSheet();
              endLoadingDialog();
            },
          });
        }}
      />
    );
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit category</SheetTitle>
        <SheetDescription>Edit your category</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className={styles['form']} onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='e.g Cash, Bank, Credit Card'
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button name='update-account' disabled={isPending} type='submit'>
            Save changes
          </Button>
          <Button
            name='update-account'
            variant='destructive'
            type='button'
            disabled={isPending}
            onClick={handleDelete}
          >
            <Trash className='size-4 mr-2' /> Delete category
          </Button>
        </form>
      </Form>
    </>
  );
}
export default EditCategoryForm;
