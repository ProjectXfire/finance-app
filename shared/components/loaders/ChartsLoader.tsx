'use client';

import { Skeleton } from '..';
import styles from './Loading.module.css';

function ChartsLoader(): JSX.Element {
  return (
    <div className={styles['charts-loader']}>
      <div className={styles['charts-loader__block']}>
        <Skeleton className={styles['charts-loader__item']} />
        <Skeleton className={styles['charts-loader__item']} />
        <Skeleton className={styles['charts-loader__graph']} />
      </div>
      <div className={styles['charts-loader__block']}>
        <Skeleton className={styles['charts-loader__item']} />
        <Skeleton className={styles['charts-loader__item']} />
        <Skeleton className={styles['charts-loader__graph']} />
      </div>
    </div>
  );
}
export default ChartsLoader;
