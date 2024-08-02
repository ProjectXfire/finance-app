import { Skeleton } from '..';
import styles from './Loading.module.css';

function CardsLoader(): JSX.Element {
  return (
    <div className={styles['cards-loader-container']}>
      <div className={styles['card-loader']}>
        <div className={styles['card-loader__header']}>
          <div className={styles['card-item-container']}>
            <Skeleton className={styles['card-item']} />
            <Skeleton className={styles['card-item']} />
          </div>
          <Skeleton className={styles['card-item-icon']} />
        </div>
        <div className={styles['card-item-container']}>
          <Skeleton className={styles['card-item']} />
          <Skeleton className={styles['card-item']} />
        </div>
      </div>
      <div className={styles['card-loader']}>
        <div className={styles['card-loader__header']}>
          <div className={styles['card-item-container']}>
            <Skeleton className={styles['card-item']} />
            <Skeleton className={styles['card-item']} />
          </div>
          <Skeleton className={styles['card-item-icon']} />
        </div>
        <div className={styles['card-item-container']}>
          <Skeleton className={styles['card-item']} />
          <Skeleton className={styles['card-item']} />
        </div>
      </div>
      <div className={styles['card-loader']}>
        <div className={styles['card-loader__header']}>
          <div className={styles['card-item-container']}>
            <Skeleton className={styles['card-item']} />
            <Skeleton className={styles['card-item']} />
          </div>
          <Skeleton className={styles['card-item-icon']} />
        </div>
        <div className={styles['card-item-container']}>
          <Skeleton className={styles['card-item']} />
          <Skeleton className={styles['card-item']} />
        </div>
      </div>
    </div>
  );
}
export default CardsLoader;
