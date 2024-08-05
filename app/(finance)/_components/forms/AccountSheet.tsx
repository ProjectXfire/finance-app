'use client';

import { useFinanceSheet } from '../../_states';
import { Sheet, SheetContent } from '@/shared/components';

function NewAccountSheet(): JSX.Element {
  const isOpen = useFinanceSheet((s) => s.isOpen);
  const component = useFinanceSheet((s) => s.component);
  const close = useFinanceSheet((s) => s.close);

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent>{component}</SheetContent>
    </Sheet>
  );
}
export default NewAccountSheet;
