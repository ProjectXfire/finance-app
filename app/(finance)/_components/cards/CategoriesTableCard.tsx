'use client';

import type { Account } from '@/core/finance/models';
import { useFinanceSheet } from '../../_states';
import { useDeleteCategories, useGetCategories } from '@/core/finance/services';
import { useCustomDialog } from '@/shared/states';
import styles from './Card.module.css';
import { Plus, TriangleAlert } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomAlert,
  CustomTable,
  TableLoader,
} from '@/shared/components';
import { CategoryColumns, ConfirmDelete, NewCategoryForm } from '..';

function CategoriesTableCard(): JSX.Element {
  const { mutate } = useDeleteCategories();
  const { data, isLoading, error } = useGetCategories();

  const open = useFinanceSheet((s) => s.open);
  const setComponent = useFinanceSheet((s) => s.setComponent);

  const setDialogComponet = useCustomDialog((s) => s.setComponent);
  const openDialog = useCustomDialog((s) => s.open);
  const closeDialog = useCustomDialog((s) => s.close);
  const endLoadingDialog = useCustomDialog((s) => s.endLoading);

  const onOpenNewAccountSheet = () => {
    setComponent(<NewCategoryForm />);
    open();
  };

  const onDeleteItems = (data: Account[]) => {
    const ids = data.map((d) => d.id);
    setDialogComponet(
      <ConfirmDelete
        onDelete={() => {
          mutate(ids, {
            onSettled: () => {
              closeDialog();
              endLoadingDialog();
            },
          });
        }}
      />
    );
    openDialog();
  };

  if (isLoading) return <TableLoader />;

  if (error) {
    return (
      <CustomAlert
        variant='destructive'
        icon={<TriangleAlert className='size-4' />}
        title='Something went wrong!'
        description='Error on get the data information'
      />
    );
  }

  return (
    <Card className={styles['card']}>
      <CardHeader className={styles['header-card']}>
        <CardTitle className={styles['header-card__title']}>Categories</CardTitle>
        <Button
          className={styles['header-card__action']}
          name='new-account'
          type='button'
          size='sm'
          onClick={onOpenNewAccountSheet}
        >
          <Plus className='mr-2 size-4' /> Add new
        </Button>
      </CardHeader>
      <CardContent>
        <CustomTable
          columns={CategoryColumns}
          data={data ?? []}
          filterKey='name'
          onDeleteItems={onDeleteItems}
          disabled={false}
        />
      </CardContent>
    </Card>
  );
}
export default CategoriesTableCard;
