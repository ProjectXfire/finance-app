'use client';

import { useCustomDialog } from '@/shared/states';
import { Dialog, DialogContent, DialogHeader } from '..';
import { DeleteAccount } from '@/app/(finance)/_components';

function CustomDialog(): JSX.Element {
  const component = useCustomDialog((s) => s.component);
  const isOpen = useCustomDialog((s) => s.isOpen);
  const close = useCustomDialog((s) => s.close);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>{component}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default CustomDialog;
