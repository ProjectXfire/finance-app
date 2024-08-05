'use client';

import type { DateRange } from 'react-day-picker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { format, subDays } from 'date-fns';
import styles from './Filter.module.css';
import { AccountFilter, DateFilter } from '..';

function Filter(): JSX.Element {
  const params = useSearchParams();
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    to: to ? new Date(to) : defaultTo,
    from: from ? new Date(from) : defaultFrom,
  };

  const pathname = usePathname();
  const router = useRouter();
  const accountId = params.get('accountId') ?? 'all';

  const onChangeDate = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, 'yyyy-MM-dd'),
      to: format(dateRange?.to || defaultTo, 'yyyy-MM-dd'),
      accountId: accountId === 'all' ? '' : accountId,
    };
    const url = qs.stringifyUrl(
      { url: pathname, query },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const onChange = (newValue: string) => {
    const query = { accountId: newValue, to, from };
    if (newValue === 'all') query.accountId = '';
    const url = qs.stringifyUrl(
      { url: pathname, query },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const onReset = () => {
    const url = qs.stringifyUrl(
      { url: pathname, query: {} },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  if (pathname === '/' || pathname === '/transactions')
    return (
      <div className={styles.filter}>
        <AccountFilter defaultValue={accountId} onChange={onChange} />
        <DateFilter value={paramState} onChange={onChangeDate} onReset={onReset} />
      </div>
    );

  return <></>;
}
export default Filter;
