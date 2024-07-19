'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCategorySchema } from '@/core/finance/schemas';
import { useCreateCategory } from '@/core/finance/services';
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
import { useFinanceSheet } from '../../_states';

const formSchema = insertCategorySchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

function NewCategoryForm(): JSX.Element {
  const { mutate, isPending } = useCreateCategory();
  const close = useFinanceSheet((s) => s.close);

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
        <SheetTitle>New category</SheetTitle>
        <SheetDescription>Create a new category</SheetDescription>
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
                  <Input {...field} placeholder='e.g Food, Travel, etc.' disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button name='create-category' type='submit' disabled={isPending}>
            Create category
          </Button>
        </form>
      </Form>
    </>
  );
}
export default NewCategoryForm;
