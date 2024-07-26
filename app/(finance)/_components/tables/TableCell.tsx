'use client';

import { useFinanceSheet } from '../../_states';
import styles from './Table.module.css';

interface Props {
  cellValue: string;
  component: React.ReactNode;
}

function TableCell({ cellValue, component }: Props): JSX.Element {
  const open = useFinanceSheet((s) => s.open);
  const setComponent = useFinanceSheet((s) => s.setComponent);

  const onClick = () => {
    open();
    setComponent(component);
  };

  return (
    <button className={styles.cell} type='button' name='cell' onClick={onClick}>
      {cellValue ? cellValue : '<empty>'}
    </button>
  );
}
export default TableCell;
