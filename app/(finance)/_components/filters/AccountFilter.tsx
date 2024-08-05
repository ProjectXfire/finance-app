'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './Filter.module.css';
import {
  Loading,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components';
import { useGetAccounts } from '@/core/finance/services';

interface Props {
  defaultValue: string;
  onChange: (value: string) => void;
}

function AccountFilter({ defaultValue, onChange }: Props): JSX.Element {
  const { isLoading, error, data } = useGetAccounts();

  if (isLoading) return <Loading />;

  if (error || !data) return <p>Error</p>;

  return (
    <Select disabled={false} value={defaultValue} onValueChange={onChange}>
      <SelectTrigger className={styles['filter-select']}>
        <SelectValue placeholder='Account' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All accounts</SelectItem>
        {data.map((acc) => (
          <SelectItem key={acc.id} value={acc.id}>
            {acc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default AccountFilter;
