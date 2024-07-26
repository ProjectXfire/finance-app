'use client';

import type { Transaction } from '@/core/finance/models';
import { useFinanceSheet } from '../../_states';
import { useDeleteTransactions, useGetTransactions } from '@/core/finance/services';
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
import { ConfirmDelete, NewTransactionForm, TransactionColumns } from '..';

function TransactionsTableCard(): JSX.Element {
  const { mutate } = useDeleteTransactions();
  const { data, error, isLoading } = useGetTransactions();

  const setComponent = useFinanceSheet((s) => s.setComponent);
  const open = useFinanceSheet((s) => s.open);

  const setDialogComponet = useCustomDialog((s) => s.setComponent);
  const openDialog = useCustomDialog((s) => s.open);
  const closeDialog = useCustomDialog((s) => s.close);
  const endLoadingDialog = useCustomDialog((s) => s.endLoading);

  const onOpenNewAccountSheet = () => {
    setComponent(<NewTransactionForm />);
    open();
  };

  const onDeleteItems = (data: Transaction[]) => {
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
        <CardTitle className={styles['header-card__title']}>Transactions</CardTitle>
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
          columns={TransactionColumns}
          data={data ?? []}
          filterKey='account'
          onDeleteItems={onDeleteItems}
          disabled={false}
          filterPlaceholder='Filter by account...'
        />
      </CardContent>
    </Card>
  );
}
export default TransactionsTableCard;
