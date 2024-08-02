'use client';

import { format } from 'date-fns';
import styles from './Tooltip.module.css';
import { formatCurrency } from '@/shared/utils';

function CustomTooltip({ active, payload }: any): JSX.Element {
  if (!active) return <></>;

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expenses = payload[1].value;

  return (
    <div className={styles['custom-tooltip']}>
      <p className={styles['custom-tooltip__date']}>{format(date, 'MMM dd, yyy')}</p>
      <div className={styles['custom-tooltip__box-value']}>
        <div className={styles['custom-tooltip__dot']} />
        <p>Income</p>
        <p
          className={`${styles['custom-tooltip__value']} ${styles['custom-tooltip__value--plus']}`}
        >
          {formatCurrency(income)}
        </p>
      </div>
      <div className={styles['custom-tooltip__box-value']}>
        <div className={styles['custom-tooltip__dot']} />
        <p>Expenses</p>
        <p
          className={`${styles['custom-tooltip__value']} ${styles['custom-tooltip__value--minus']}`}
        >
          {formatCurrency(expenses * -1)}
        </p>
      </div>
    </div>
  );
}

export default CustomTooltip;
