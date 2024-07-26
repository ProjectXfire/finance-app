'use client';

import type { Account, Category, Transaction } from '@/core/finance/models';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { insertTransactionSchema } from '@/core/finance/schemas';
import { useFinanceSheet } from '../../_states';
import { useGetAccounts, useGetCategories, useUpdateTransaction } from '@/core/finance/services';
import styles from './Form.module.css';
import {
  Button,
  CustomCurrencyInput,
  CustomSelect,
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Loading,
  SheetHeader,
  SheetTitle,
  Textarea,
  SheetDescription,
} from '@/shared/components';

interface Props {
  data: Transaction;
}

const formSchema = insertTransactionSchema.omit({ id: true });
type FormValues = z.input<typeof formSchema>;

function EditTransactionForm({ data }: Props): JSX.Element {
  const { mutate, isPending } = useUpdateTransaction(data.id);
  const categories = useGetCategories();
  const accounts = useGetAccounts();

  const close = useFinanceSheet((s) => s.close);

  const isLoading = categories.isLoading || accounts.isLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: data.notes,
      payee: data.payee,
      date: new Date(data.date),
      categoryId: data.categoryId,
      amount: data.amount,
      accountId: data.accountId,
    },
  });

  const createSelectValues = (values: Account[] | Category[] | undefined) => {
    if (!values) return [];
    return values.map((v) => ({
      key: v.id,
      label: v.name,
      value: v.id,
    }));
  };

  const handleSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit your transaction</SheetTitle>
        <SheetDescription>{data.account}</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className={styles['form']} onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name='date'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    error={fieldState.isTouched && !field.value}
                    disabled={isPending}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='accountId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                {isLoading ? (
                  <div className='flex justify-center'>
                    <Loading />
                  </div>
                ) : (
                  <CustomSelect
                    placeholder='Select an account'
                    data={createSelectValues(accounts.data)}
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='categoryId'
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
                    data={createSelectValues(categories.data)}
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                )}
              </FormItem>
            )}
          />
          <FormField
            name='amount'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <CustomCurrencyInput
                    value={field.value.toString()}
                    onChange={field.onChange}
                    disabled={isPending}
                    placeholder='0.00'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='payee'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payee</FormLabel>
                <FormControl>
                  <Input type='text' {...field} placeholder='e.g ' disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='notes'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className='resize-none'
                    placeholder='Write a note...'
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button name='create-category' type='submit' disabled={isPending || isLoading}>
            Update transaction
          </Button>
        </form>
      </Form>
    </>
  );
}
export default EditTransactionForm;
