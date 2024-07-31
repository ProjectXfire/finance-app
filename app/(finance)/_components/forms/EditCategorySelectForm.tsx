'use client';

import type { Category } from '@/core/finance/models';
import type { UpdateTransactionDto } from '@/core/finance/dtos';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useCustomDialog } from '@/shared/states';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCategorySchema } from '@/core/finance/schemas';
import { useFinanceSheet } from '../../_states';
import { useGetCategories, useUpdateTransaction } from '@/core/finance/services';
import styles from './Form.module.css';
import {
  Button,
  CustomSelect,
  Form,
  FormField,
  FormItem,
  FormLabel,
  Loading,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components';

const formSchema = insertCategorySchema.pick({ id: true });

type FormValues = z.input<typeof formSchema>;

interface Props {
  transactionId: string;
  transaction: UpdateTransactionDto;
}

function EditCategorySelectForm({ transaction, transactionId }: Props): JSX.Element {
  const { data, isLoading, error } = useGetCategories();
  const { mutate, isPending } = useUpdateTransaction(transactionId);

  const closeAccountSheet = useFinanceSheet((s) => s.close);

  const loading = isLoading || isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: '' },
  });

  const createSelectValues = (values: Category[] | undefined) => {
    if (!values) return [];
    return values.map((v) => ({
      key: v.id,
      label: v.name,
      value: v.id,
    }));
  };

  const handleSubmit = (values: FormValues) => {
    if (!values.id) return;
    const updateTransactionData: UpdateTransactionDto = {
      ...transaction,
      categoryId: values.id,
    };
    mutate(updateTransactionData, {
      onSuccess: () => {
        closeAccountSheet();
      },
    });
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Add category</SheetTitle>
        <SheetDescription>Add a category to your transaction</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className={styles['form']} onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name='id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                {isLoading ? (
                  <div className='flex justify-center'>
                    <Loading />
                  </div>
                ) : (
                  <CustomSelect
                    placeholder='Select a category'
                    data={createSelectValues(data)}
                    onChange={field.onChange}
                  />
                )}
              </FormItem>
            )}
          />
          <Button name='update-account' disabled={loading} type='submit'>
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
}
export default EditCategorySelectForm;
