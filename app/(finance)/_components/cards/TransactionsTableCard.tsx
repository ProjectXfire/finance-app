'use client';

import type { ImportColum } from '../../_constants';
import type { CSVImport } from '../../_interfaces';
import type { Transaction } from '@/core/finance/models';
import { useState } from 'react';
import { useFinanceSheet } from '../../_states';
import { useDeleteTransactions, useGetTransactions } from '@/core/finance/services';
import { useCustomDialog } from '@/shared/states';
import styles from './Card.module.css';
import { Plus, TriangleAlert } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomAlert,
  CustomTable,
  TableLoader,
} from '@/shared/components';
import {
  ConfirmCreateTransactions,
  ConfirmDelete,
  ImportCard,
  NewTransactionForm,
  TransactionColumns,
  UploadButton,
} from '..';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESPONSE: CSVImport = { data: [], errors: [], meta: [] };

function TransactionsTableCard(): JSX.Element {
  const { mutate } = useDeleteTransactions();
  const { data, error, isLoading } = useGetTransactions();

  const setComponent = useFinanceSheet((s) => s.setComponent);
  const open = useFinanceSheet((s) => s.open);

  const setDialogComponent = useCustomDialog((s) => s.setComponent);
  const openDialog = useCustomDialog((s) => s.open);
  const closeDialog = useCustomDialog((s) => s.close);
  const endLoadingDialog = useCustomDialog((s) => s.endLoading);

  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState<CSVImport>(INITIAL_IMPORT_RESPONSE);

  const onOpenNewAccountSheet = () => {
    setComponent(<NewTransactionForm />);
    open();
  };

  const onDeleteItems = (data: Transaction[]) => {
    const ids = data.map((d) => d.id);
    setDialogComponent(
      <ConfirmDelete
        onDelete={() => {
          mutate(ids, {
            onSettled: () => {
              closeDialog();
              endLoadingDialog();
            },
          });
        }}
      />
    );
    openDialog();
  };

  const onUploadCSV = (results: CSVImport) => {
    setVariant(VARIANTS.IMPORT);
    setImportResults(results);
  };

  const onCancelCSV = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(INITIAL_IMPORT_RESPONSE);
  };

  const onSubmitImportFile = (data: ImportColum[]) => {
    openDialog();
    setDialogComponent(<ConfirmCreateTransactions importData={data} onEnd={onCancelCSV} />);
  };

  if (isLoading) return <TableLoader />;

  if (error) {
    return (
      <CustomAlert
        variant='destructive'
        icon={<TriangleAlert className='size-4' />}
        title='Something went wrong!'
        description='Error on get the data information'
      />
    );
  }

  if (variant === VARIANTS.IMPORT)
    return (
      <ImportCard results={importResults} onCancel={onCancelCSV} onSubmit={onSubmitImportFile} />
    );

  return (
    <Card className={styles['card']}>
      <CardHeader className={styles['header-card']}>
        <CardTitle className={styles['header-card__title']}>Transactions</CardTitle>
        <div className={styles['header-card__actions']}>
          <Button
            className={styles['header-card__action']}
            name='new-account'
            type='button'
            size='sm'
            onClick={onOpenNewAccountSheet}
          >
            <Plus className='mr-2 size-4' /> Add new
          </Button>
          <UploadButton onUpload={onUploadCSV} />
        </div>
      </CardHeader>
      <CardContent>
        <CustomTable
          columns={TransactionColumns}
          data={data ?? []}
          filterKey='account'
          onSelectRow={onDeleteItems}
          disabled={false}
          filterPlaceholder='Filter by account...'
        />
      </CardContent>
    </Card>
  );
}
export default TransactionsTableCard;
