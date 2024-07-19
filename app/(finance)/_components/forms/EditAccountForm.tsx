'use client';

import type { Account } from '@/core/finance/models';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useCustomDialog } from '@/shared/states';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertAccountSchema } from '@/core/finance/schemas';
import { useAccountSheet } from '../../_states';
import { useUpdateAccount } from '@/core/finance/services';
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
  account: Account;
}

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

function EditAccountForm({ account }: Props): JSX.Element {
  const { id, name } = account;

  const { mutate, isPending } = useUpdateAccount(id);

  const open = useCustomDialog((s) => s.open);
  const closeAccountSheet = useAccountSheet((s) => s.close);
  const setComponent = useCustomDialog((s) => s.setComponent);

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
    open();
    setComponent(<ConfirmDelete ids={[id]} onCompleted={() => closeAccountSheet()} />);
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit account</SheetTitle>
        <SheetDescription>Edit your account to track your transactions</SheetDescription>
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
            <Trash className='size-4 mr-2' /> Delete account
          </Button>
        </form>
      </Form>
    </>
  );
}
export default EditAccountForm;
