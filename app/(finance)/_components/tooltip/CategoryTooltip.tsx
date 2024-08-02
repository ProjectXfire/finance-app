'use client';

import styles from './Tooltip.module.css';
import { formatCurrency } from '@/shared/utils';

function CustomTooltip({ active, payload }: any): JSX.Element {
  if (!active) return <></>;

  const name = payload[0].payload.name;
  const value = payload[0].value;

  return (
    <div className={styles['custom-tooltip']}>
      <p className={styles['custom-tooltip__date']}>{name}</p>
      <div className={styles['custom-tooltip__box-value']}>
        <div className={styles['custom-tooltip__dot']} />
        <p>Expenses</p>
        <p
          className={`${styles['custom-tooltip__value']} ${styles['custom-tooltip__value--minus']}`}
        >
          {formatCurrency(value * -1)}
        </p>
      </div>
    </div>
  );
}

export default CustomTooltip;
