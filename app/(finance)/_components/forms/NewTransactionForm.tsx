'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFinanceSheet } from '../../_states';
import { insertTransactionSchema } from '@/core/finance/schemas';
import { useCreateTransaction, useGetAccounts, useGetCategories } from '@/core/finance/services';
import styles from './Form.module.css';
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Input,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Textarea,
  Loading,
  CustomSelect,
  DatePicker,
  CustomCurrencyInput,
} from '@/shared/components';
import { Account, Category } from '@/core/finance/models';

const formSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;

function NewTransactionForm(): JSX.Element {
  const { mutate, isPending } = useCreateTransaction();
  const categories = useGetCategories();
  const accounts = useGetAccounts();

  const isLoading = categories.isLoading || accounts.isLoading;

  const close = useFinanceSheet((s) => s.close);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: '', payee: '', categoryId: '', amount: 0 },
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
        <SheetTitle>New transaction</SheetTitle>
        <SheetDescription>Create a new transaction for your account</SheetDescription>
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
            Create transaction
          </Button>
        </form>
      </Form>
    </>
  );
}
export default NewTransactionForm;
