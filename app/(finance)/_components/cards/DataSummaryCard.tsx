import { formatCurrency, formatPercentage } from '@/shared/utils';
import styles from './Card.module.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CountUp,
} from '@/shared/components';

type Variant = 'default' | 'success' | 'danger' | 'warning';

interface Props {
  title: string;
  value: number;
  percentageChange: number;
  icon: React.ReactNode;
  variant: Variant;
  dateRange: string;
}

function DataSummaryCard({
  title,
  value = 0,
  icon,
  percentageChange = 0,
  dateRange,
  variant,
}: Props): JSX.Element {
  return (
    <Card className={styles['data-summary-card']}>
      <CardHeader className={styles['data-summary-card__header']}>
        <div>
          <CardTitle className={styles['data-summary-card__title']}>{title}</CardTitle>
          <CardDescription>{dateRange}</CardDescription>
        </div>
        <div className={`${styles['data-summary-card__icon']} ${styles[variant]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <CountUp
          className={styles['data-summary-card__value']}
          preserveValue
          end={value}
          decimals={2}
          duration={2}
          formattingFn={formatCurrency}
        />
        <p
          className={`${styles['data-summary-card__percentage']} ${
            percentageChange >= 0
              ? styles['data-summary-card__percentage--plus']
              : styles['data-summary-card__percentage--minus']
          }`}
        >
          {formatPercentage(percentageChange)} from last period
        </p>
      </CardContent>
    </Card>
  );
}
export default DataSummaryCard;
