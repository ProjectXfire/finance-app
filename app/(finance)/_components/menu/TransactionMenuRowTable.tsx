'use client';

import type { Transaction } from '@/core/finance/models';
import { useDeleteTransactions } from '@/core/finance/services';
import { useFinanceSheet } from '../../_states';
import { useCustomDialog } from '@/shared/states';
import styles from './Menu.module.css';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components';
import { ConfirmDelete, EditTransactionForm } from '..';

interface Props {
  data: Transaction;
}

function TransactionMenuRowTable({ data }: Props): JSX.Element {
  const { mutate } = useDeleteTransactions();

  const open = useFinanceSheet((s) => s.open);
  const setComponent = useFinanceSheet((s) => s.setComponent);

  const openDialog = useCustomDialog((s) => s.open);
  const setComponentDialog = useCustomDialog((s) => s.setComponent);
  const closeDialog = useCustomDialog((s) => s.close);
  const endLoadingDialog = useCustomDialog((s) => s.endLoading);

  const onOpenCategotyEditSheet = () => {
    open();
    setComponent(<EditTransactionForm data={data} />);
  };

  const onOpenDialog = () => {
    openDialog();
    setComponentDialog(
      <ConfirmDelete
        onDelete={() => {
          mutate([data.id], {
            onSettled: () => {
              closeDialog();
              endLoadingDialog();
            },
          });
        }}
      />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className='size-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{data.account}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='flex justify-between' onClick={onOpenCategotyEditSheet}>
          Edit <Edit className='size-4' />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='p-0' onClick={onOpenDialog}>
          <Button size='sm' variant='secondary' className={styles['menu-delete']}>
            Delete <Trash className='size-4' />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default TransactionMenuRowTable;
