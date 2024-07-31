'use client';

import type { CSVImport } from '../../_interfaces';
import type { ImportColum } from '../../_constants';
import { useState } from 'react';
import { format, parse } from 'date-fns';
import { requiredColumnsOptions } from '../../_constants';
import { convertAmountToMiliunits } from '@/shared/utils';
import styles from './Card.module.css';
import { CircleArrowRight, XCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components';
import { CSVTable } from '..';
import { toast } from 'sonner';

interface Props {
  results: CSVImport;
  onCancel: () => void;
  onSubmit: (data: ImportColum[]) => void;
}

interface ColumnsState {
  [key: string]: string | null;
}

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

function ImportCard({ results, onCancel, onSubmit }: Props): JSX.Element {
  const tableHeader = results.data[0];
  const tableData = results.data.slice(1);

  const [selectedColumns, setSelectedColumns] = useState<ColumnsState>({});

  const progress = Object.values(selectedColumns).filter(Boolean);

  const onSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((pv) => {
      const newSelectedColumns = { ...pv };
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === 'skip') value = null;
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const handleContinue = () => {
    const csvArrayObject: Array<ImportColum> = [];
    const columnsHeader = getColumnHeaders(selectedColumns);
    tableData.forEach((row) => {
      const object: any = {};
      row.forEach((rowData, i) => {
        if (columnsHeader[i]) {
          object[columnsHeader[i]] = rowData;
        }
      });
      csvArrayObject.push(object);
    });
    try {
      const data = csvArrayObject.map((item) => {
        const amount = convertAmountToMiliunits(item.amount);
        if (isNaN(amount)) throw new Error('Invalid amount value');
        const date = format(parse(item.date, dateFormat, new Date()), outputFormat);
        return {
          ...item,
          amount,
          date,
        };
      });
      onSubmit(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getColumnHeaders = (columns: ColumnsState) => {
    const selectedColumnsKeyOrder: Record<number, string> = {};
    for (const key in selectedColumns) {
      if (columns[key] && progress.includes(columns[key]) && selectedColumns[key]) {
        selectedColumnsKeyOrder[getColumnIndex(key)] = selectedColumns[key];
      }
    }
    return selectedColumnsKeyOrder;
  };

  const getColumnIndex = (column: string): number => {
    return Number(column.split('_')[1]);
  };

  return (
    <Card className={styles['card']}>
      <CardHeader className={styles['header-card']}>
        <CardTitle className={styles['header-card__title']}>Import CSV</CardTitle>
        <div className={styles['header-card__actions']}>
          <Button
            className={styles['header-card__action']}
            name='cancel-upload'
            variant='destructive'
            type='button'
            size='sm'
            onClick={onCancel}
          >
            <XCircle className='mr-2 size-4' /> Cancel
          </Button>
          <Button
            type='button'
            name='submit-upload'
            size='sm'
            disabled={progress.length !== requiredColumnsOptions.length}
            onClick={handleContinue}
          >
            <CircleArrowRight className='mr-2 size-4' /> Continue {progress.length} /{' '}
            {requiredColumnsOptions.length}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CSVTable
          header={tableHeader}
          body={tableData}
          selectedColumns={selectedColumns}
          onChange={onSelectChange}
        />
      </CardContent>
    </Card>
  );
}
export default ImportCard;
