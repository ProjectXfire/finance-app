'use client';

import { useSearchParams } from 'next/navigation';
import { formatDateRange } from '@/shared/utils';
import { useGetSummary } from '@/core/finance/services';
import styles from './Grid.module.css';
import { CardsLoader, CustomAlert } from '@/shared/components';
import { PiggyBank, TriangleAlert, TrendingUp, TrendingDown } from 'lucide-react';
import { DataSummaryCard } from '..';

function DataGrid(): JSX.Element {
  const { data, isLoading, error } = useGetSummary();

  const params = useSearchParams();
  const from = params.get('from');
  const to = params.get('to');

  const dateRangeLabel = formatDateRange({ from, to });

  if (isLoading) return <CardsLoader />;

  if (error || !data) {
    return (
      <CustomAlert
        variant='destructive'
        icon={<TriangleAlert className='size-4' />}
        title='Something went wrong!'
        description='Error on get the data information'
      />
    );
  }

  return (
    <section className={styles['data-grid']}>
      <DataSummaryCard
        title='Remaining'
        value={data.remainingAmount}
        percentageChange={data.remainingChange}
        dateRange={dateRangeLabel}
        variant='default'
        icon={<PiggyBank />}
      />
      <DataSummaryCard
        title='Income'
        value={data.incomeAmount}
        percentageChange={data.incomeChange}
        dateRange={dateRangeLabel}
        variant='success'
        icon={<TrendingUp />}
      />
      <DataSummaryCard
        title='Expenses'
        value={data.expensesAmount}
        percentageChange={data.expenseChange}
        dateRange={dateRangeLabel}
        variant='danger'
        icon={<TrendingDown />}
      />
    </section>
  );
}
export default DataGrid;
