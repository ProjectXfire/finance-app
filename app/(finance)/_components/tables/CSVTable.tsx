'use client';

import styles from './Table.module.css';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/shared/components';
import { TableHeadSelect } from '..';

interface Props {
  header: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
}

function CSVTable({ header, body, onChange, selectedColumns }: Props): JSX.Element {
  return (
    <Table>
      <TableHeader className={styles['import-table-header']}>
        <TableRow>
          {header.map((h, i) => (
            <TableHeadSelect
              key={i}
              columnIndex={i}
              selectedColumns={selectedColumns}
              onChange={onChange}
            />
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {body.map((rowData, i) => (
          <TableRow key={i}>
            {rowData.map((data, i) => (
              <TableCell key={i}>{data}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default CSVTable;
