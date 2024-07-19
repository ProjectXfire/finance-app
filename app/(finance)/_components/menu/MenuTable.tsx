'use client';

import type { Account } from '@/core/finance/models';
import { useAccountSheet } from '../../_states';
import { useCustomDialog } from '@/shared/states';
import styles from './Menu.module.css';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import { ConfirmDelete, EditAccountForm } from '..';

interface Props {
  data: Account;
}

function MenuTable({ data }: Props): JSX.Element {
  const open = useAccountSheet((s) => s.open);
  const setComponent = useAccountSheet((s) => s.setComponent);

  const openDialog = useCustomDialog((s) => s.open);
  const setComponentDialog = useCustomDialog((s) => s.setComponent);

  const onOpenAccountEditSheet = () => {
    open();
    setComponent(<EditAccountForm account={data} />);
  };

  const onOpenDialog = () => {
    openDialog();
    setComponentDialog(<ConfirmDelete ids={[data.id]} />);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className='size-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='flex justify-between' onClick={onOpenAccountEditSheet}>
          Edit <Edit className='size-4' />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='p-0' onClick={onOpenDialog}>
          <Button size='sm' variant='secondary' className={styles['account-menu-delete']}>
            Delete <Trash className='size-4' />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default MenuTable;
