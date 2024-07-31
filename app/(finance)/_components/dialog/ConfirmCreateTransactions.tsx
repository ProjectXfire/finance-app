'use client';

import type { ImportColum } from '../../_constants';
import type { CreateTransactionDto } from '@/core/finance/dtos';
import { useCreateTransactions, useGetAccounts } from '@/core/finance/services';
import { useCustomDialog } from '@/shared/states';
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  importData: ImportColum[];
  onEnd?: () => void;
}

function ConfirmCreateTransactions({ importData, onEnd }: Props): JSX.Element {
  const { data, error, isLoading } = useGetAccounts();
  const { mutate, isPending } = useCreateTransactions();

  const [accountSelected, setAccountSelected] = useState('');

  const loading = isLoading || isPending;

  const close = useCustomDialog((s) => s.close);

  const onClose = () => {
    close();
  };

  const onSubmit = () => {
    if (!accountSelected) {
      toast.warning('Please select an account');
      return;
    }
    const newDataToSaveInDb: CreateTransactionDto[] = importData.map((item) => ({
      ...item,
      accountId: accountSelected,
      notes: '',
    }));
    mutate(newDataToSaveInDb, {
      onSuccess: () => {
        onClose();
        if (onEnd) onEnd();
      },
      onError: () => {
        onClose();
      },
    });
  };

  if (error) {
    return (
      <>
        <DialogTitle>Error</DialogTitle>
        <DialogDescription>Something went wrong!</DialogDescription>
      </>
    );
  }

  return (
    <>
      <DialogTitle>Create new transactions</DialogTitle>
      <DialogDescription>
        This action will create a new group of transactions with the account selected.
      </DialogDescription>
      <div className='pt-2'>
        <Select onValueChange={(value) => setAccountSelected(value)} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder='Select an account' />
          </SelectTrigger>
          <SelectContent>
            {data?.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className='pt-4'>
        <Button variant='ghost' size='sm' type='submit' disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant='destructive' size='sm' type='submit' disabled={loading} onClick={onSubmit}>
          Save
        </Button>
      </DialogFooter>
    </>
  );
}
export default ConfirmCreateTransactions;
