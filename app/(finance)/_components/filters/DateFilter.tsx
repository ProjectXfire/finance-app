'use client';

import type { DateRange } from 'react-day-picker';
import { useState } from 'react';
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/shared/components';
import styles from './Filter.module.css';

import { CalendarIcon } from 'lucide-react';
import { formatDateRange } from '@/shared/utils';

interface Props {
  onChange: (value: any) => void;
  onReset?: () => void;
  value: { from: Date; to: Date };
}

function DateFilter({ value, onChange, onReset }: Props): JSX.Element {
  const [date, setDate] = useState<DateRange | undefined>();

  const onSelectDate = (date?: DateRange) => {
    setDate(date);
  };

  const onApply = () => {
    onChange(date);
  };

  const onDateReset = () => {
    setDate(undefined);
    if (onReset) onReset();
  };

  return (
    <div className={styles['date-filter']}>
      <Popover>
        <PopoverTrigger className={styles['filter-select']} asChild>
          <Button type='button' variant='outline'>
            <CalendarIcon className='size-4 mr-2' />
            <span className={styles['date-filter__label']}>{formatDateRange(value)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={styles['date-filter__popover']}>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            numberOfMonths={2}
            onSelect={onSelectDate}
          />
          <div className={styles['date-filter__actions']}>
            <PopoverClose asChild>
              <Button
                variant='secondary'
                className={styles['date-filter__button']}
                size='sm'
                onClick={onDateReset}
              >
                Reset
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button className={styles['date-filter__button']} size='sm' onClick={onApply}>
                Apply
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateFilter;
