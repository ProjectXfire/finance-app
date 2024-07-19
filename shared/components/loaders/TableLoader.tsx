import styles from './Loading.module.css';
import { Card, CardContent, CardHeader, Loading, Skeleton } from '..';

function TableLoader(): JSX.Element {
  return (
    <div className={styles['table-loader']}>
      <Card>
        <CardHeader>
          <div className={styles['table-loader__header']}>
            <Skeleton className={styles['table-loader__block']} />
            <Skeleton className={styles['table-loader__block']} />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className={styles['table-loader__input']} />
          <div className={styles['table-loader__table']}>
            <Loading />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default TableLoader;
