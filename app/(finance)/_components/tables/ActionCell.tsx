'use client';

import type { Account } from '@/core/finance/models';
import { useAccountSheet } from '../../_states';
import { Button } from '@/shared/components';
import { Edit } from 'lucide-react';
import { EditAccountForm } from '..';

interface Props {
  data: Account;
}

function ActionCell({ data }: Props): JSX.Element {
  const open = useAccountSheet((s) => s.open);
  const setComponent = useAccountSheet((s) => s.setComponent);

  const onOpenEditSheet = () => {
    open();
    setComponent(<EditAccountForm account={data} />);
  };

  return (
    <Button name='edit' type='button' variant='ghost' onClick={onOpenEditSheet}>
      <Edit className='size-4' />
    </Button>
  );
}
export default ActionCell;
