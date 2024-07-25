'use client';

import { useFinanceSheet } from '../../_states';
import styles from './Card.module.css';
import { Plus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components';
import { NewTransactionForm } from '..';

function TransactionsTableCard(): JSX.Element {
  const setComponent = useFinanceSheet((s) => s.setComponent);
  const open = useFinanceSheet((s) => s.open);

  const onOpenNewAccountSheet = () => {
    setComponent(<NewTransactionForm />);
    open();
  };

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
      <CardContent></CardContent>
    </Card>
  );
}
export default TransactionsTableCard;
