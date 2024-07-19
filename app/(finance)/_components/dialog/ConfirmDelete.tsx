'use client';

import { Button, DialogDescription, DialogFooter, DialogTitle } from '@/shared/components';
import { useCustomDialog } from '@/shared/states';

interface Props {
  onDelete: () => void;
}

function ConfirmDelete({ onDelete }: Props): JSX.Element {
  const close = useCustomDialog((s) => s.close);
  const isLoading = useCustomDialog((s) => s.isLoading);
  const startLoading = useCustomDialog((s) => s.startLoading);

  const handleDelete = () => {
    startLoading();
    onDelete();
  };

  const onClose = () => {
    close();
  };

  return (
    <>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </DialogDescription>
      <DialogFooter className='pt-4'>
        <Button variant='ghost' size='sm' type='submit' disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          size='sm'
          type='submit'
          disabled={isLoading}
          onClick={handleDelete}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}
export default ConfirmDelete;
