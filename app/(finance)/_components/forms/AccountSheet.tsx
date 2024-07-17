'use client';

import { Sheet, SheetContent } from '@/shared/components';
import { useAccountSheet } from '../../_states';

function NewAccountSheet(): JSX.Element {
  const isOpen = useAccountSheet((s) => s.isOpen);
  const component = useAccountSheet((s) => s.component);
  const close = useAccountSheet((s) => s.close);

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent>{component}</SheetContent>
    </Sheet>
  );
}
export default NewAccountSheet;
