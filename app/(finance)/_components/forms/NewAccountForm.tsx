'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertAccountSchema } from '@/core/finance/schemas';
import { useCreateAccount } from '@/core/finance/services';
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
} from '@/shared/components';
import { useAccountSheet } from '../../_states';

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

function NewAccountForm(): JSX.Element {
  const { mutate, isPending } = useCreateAccount();
  const close = useAccountSheet((s) => s.close);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

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
        <SheetTitle>New account</SheetTitle>
        <SheetDescription>Create a new account to track your transactions</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className={styles['account-form']} onSubmit={form.handleSubmit(handleSubmit)}>
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
          <Button name='create-account' type='submit' disabled={isPending}>
            Create account
          </Button>
        </form>
      </Form>
    </>
  );
}
export default NewAccountForm;
