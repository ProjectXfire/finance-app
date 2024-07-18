'use client';

import { Account } from '@/core/finance/models';
import { useAccountSheet } from '../../_states';
import styles from './Card.module.css';
import { Plus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CustomTable } from '@/shared/components';
import { AccountColumns } from '..';

const temp: Account[] = [
  {
    id: '728ed52asf',
    name: 'Acc1',
  },
  {
    id: '728asded52f',
    name: 'Acc2',
  },
  {
    id: '728e323d52f',
    name: 'Acc3',
  },
];

function AccountsTableCard(): JSX.Element {
  const open = useAccountSheet((s) => s.open);

  const onDeleteItems = (data: Account[]) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader className={styles['accounts-header-card']}>
        <CardTitle className={styles['accounts-header-card__title']}>Accounts</CardTitle>
        <Button
          className={styles['accounts-header-card__action']}
          name='new-account'
          type='button'
          size='sm'
          onClick={open}
        >
          <Plus className='mr-2 size-4' /> Add new
        </Button>
      </CardHeader>
      <CardContent>
        <CustomTable
          columns={AccountColumns}
          data={temp}
          filterKey='name'
          onDeleteItems={onDeleteItems}
          disabled={false}
        />
      </CardContent>
    </Card>
  );
}
export default AccountsTableCard;
