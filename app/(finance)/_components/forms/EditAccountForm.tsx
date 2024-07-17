import type { Account } from '@/core/finance/models';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { insertAccountSchema } from '@/core/finance/schemas';
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

interface Props {
  account: Account;
}

const formSchema = insertAccountSchema.pick({ name: true, id: true, userId: true });

type FormValues = z.input<typeof formSchema>;

function EditAccountForm({ account }: Props): JSX.Element {
  const { id, name, userId } = account;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { id, name, userId },
  });

  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  const handleDelete = () => {};

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
                  <Input {...field} placeholder='e.g Cash, Bank, Credit Card' />
                </FormControl>
              </FormItem>
            )}
          />
          <Button name='update-account' type='submit'>
            Save changes
          </Button>
          <Button name='update-account' type='button' onClick={handleDelete}>
            <Trash /> Delete account
          </Button>
        </form>
      </Form>
    </>
  );
}
export default EditAccountForm;
