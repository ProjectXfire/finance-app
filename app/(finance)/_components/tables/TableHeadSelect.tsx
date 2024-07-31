import { cn } from '@/shared/utils';
import { columnsOptions } from '../../_constants';
import {
  TableHead,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/shared/components';

interface Props {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
}

function TableHeadSelect({ columnIndex, onChange, selectedColumns }: Props): JSX.Element {
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  return (
    <TableHead>
      <Select
        value={currentSelection || ''}
        onValueChange={(value) => onChange(columnIndex, value)}
      >
        <SelectTrigger
          className={cn(
            'w-full outline-none focus:ring-transparent border-none',
            currentSelection && 'text-blue-500'
          )}
        >
          <SelectValue placeholder='Skip' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='skip'>Skip</SelectItem>
          {columnsOptions.map((option, i) => {
            const disabled =
              Object.values(selectedColumns).includes(option) &&
              selectedColumns[`column_${columnIndex}`] !== option;
            return (
              <SelectItem className='capitalize' key={i} value={option} disabled={disabled}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </TableHead>
  );
}
export default TableHeadSelect;
