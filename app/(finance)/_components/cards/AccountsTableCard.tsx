'use client';

import type { Account } from '@/core/finance/models';
import { useAccountSheet } from '../../_states';
import { useGetAccounts } from '@/core/finance/services';
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
import { AccountColumns, ConfirmDelete, NewAccountForm } from '..';
import { useCustomDialog } from '@/shared/states';

function AccountsTableCard(): JSX.Element {
  const open = useAccountSheet((s) => s.open);
  const setComponent = useAccountSheet((s) => s.setComponent);
  const setDialogComponet = useCustomDialog((s) => s.setComponent);
  const openDialog = useCustomDialog((s) => s.open);
  const { data, isLoading, error } = useGetAccounts();

  const onOpenNewAccountSheet = () => {
    setComponent(<NewAccountForm />);
    open();
  };

  const onDeleteItems = (data: Account[]) => {
    const ids = data.map((d) => d.id);
    setDialogComponet(<ConfirmDelete ids={ids} />);
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
    <Card className={styles['accounts-card']}>
      <CardHeader className={styles['accounts-header-card']}>
        <CardTitle className={styles['accounts-header-card__title']}>Accounts</CardTitle>
        <Button
          className={styles['accounts-header-card__action']}
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
          columns={AccountColumns}
          data={data ?? []}
          filterKey='name'
          onDeleteItems={onDeleteItems}
          disabled={false}
        />
      </CardContent>
    </Card>
  );
}
export default AccountsTableCard;
