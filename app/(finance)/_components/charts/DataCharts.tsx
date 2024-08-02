'use client';

import { useGetSummary } from '@/core/finance/services';
import styles from './Chart.module.css';
import { ChartsLoader, CustomAlert } from '@/shared/components';
import { TriangleAlert } from 'lucide-react';
import { Chart, ChartCard, SpendingPie } from '..';

function DataCharts(): JSX.Element {
  const { data, isLoading, error } = useGetSummary();

  if (isLoading) return <ChartsLoader />;

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
    <section className={styles['data-charts']}>
      <ChartCard title='Transactions'>
        <Chart data={data.days} />
      </ChartCard>
      <ChartCard title='Categories'>
        <SpendingPie data={data.categories} />
      </ChartCard>
    </section>
  );
}
export default DataCharts;
