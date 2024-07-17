'use client';

import { Button } from '@/shared/components';
import { useAccountSheet } from '../../_states';
import { NewAccountForm } from '..';

function DashboardContainer(): JSX.Element {
  const open = useAccountSheet((s) => s.open);
  const setComponent = useAccountSheet((s) => s.setComponent);

  const onOpenSheetForm = () => {
    open();
    setComponent(<NewAccountForm />);
  };

  return (
    <section>
      <Button onClick={onOpenSheetForm}>Add an account</Button>
    </section>
  );
}
export default DashboardContainer;
