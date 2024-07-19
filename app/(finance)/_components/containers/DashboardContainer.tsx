'use client';

import { Button } from '@/shared/components';
import { useFinanceSheet } from '../../_states';
import { NewAccountForm } from '..';

function DashboardContainer(): JSX.Element {
  const open = useFinanceSheet((s) => s.open);
  const setComponent = useFinanceSheet((s) => s.setComponent);

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
