import type { Transaction } from '@/core/finance/models';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge, Button, Checkbox } from '@/shared/components';
import {
  EditAccountForm,
  EditCategoryForm,
  EditCategorySelectForm,
  TableCell,
  TransactionMenuRowTable,
} from '..';
import { formatCurrency } from '@/shared/utils';

export const TransactionColumns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return <span>{format(date, 'dd MMMM, yyyy')}</span>;
    },
  },
  {
    accessorKey: 'account',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Account
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { account, accountId } = row.original;
      return (
        <TableCell
          cellValue={account}
          component={<EditAccountForm account={{ id: accountId, name: account }} />}
        />
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { id, category, account, ...rest } = row.original;
      if (rest.categoryId)
        return (
          <TableCell
            cellValue={category}
            component={<EditCategoryForm category={{ id: rest.categoryId, name: category }} />}
            emptyCellMessage='<Uncategorized>'
          />
        );
      return (
        <TableCell
          cellValue={category}
          component={
            <EditCategorySelectForm
              transactionId={id}
              transaction={{ ...rest, date: new Date(rest.date) }}
            />
          }
          emptyCellMessage='<Uncategorized>'
        />
      );
    },
  },
  {
    accessorKey: 'payee',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Payee
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <Badge className='py-2.5 px-4' variant={amount < 0 ? 'destructive' : 'primary'}>
          {formatCurrency(amount)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      return <TransactionMenuRowTable data={row.original} />;
    },
  },
];

export default TransactionColumns;
