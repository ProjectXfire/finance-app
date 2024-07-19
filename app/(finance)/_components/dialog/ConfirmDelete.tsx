'use client';

import { useDeleteAccounts } from '@/core/finance/services';
import { Button, DialogDescription, DialogFooter, DialogTitle } from '@/shared/components';
import { useCustomDialog } from '@/shared/states';

interface Props {
  ids: string[];
  onCompleted?: () => void;
}

function ConfirmDelete({ ids, onCompleted }: Props): JSX.Element {
  const { mutate, isPending } = useDeleteAccounts();
  const close = useCustomDialog((s) => s.close);

  const onClose = () => {
    close();
  };

  const onDelete = () => {
    mutate(ids, {
      onSuccess: () => {
        close();
        if (onCompleted) onCompleted();
      },
    });
  };

  return (
    <>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </DialogDescription>
      <DialogFooter className='pt-4'>
        <Button variant='ghost' size='sm' type='submit' disabled={isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          size='sm'
          type='submit'
          disabled={isPending}
          onClick={onDelete}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}
export default ConfirmDelete;
