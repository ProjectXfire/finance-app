'use client';

import { format } from 'date-fns';
import type { Noop } from 'react-hook-form';
import { Calendar as CalendarIcon } from 'lucide-react';
import { SelectSingleEventHandler } from 'react-day-picker';
import styles from './Form.module.css';
import { Popover, PopoverContent, PopoverTrigger, Button, Calendar } from '..';

interface Props {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
  error?: boolean;
  onBlur?: Noop;
}

function DatePicker({ value, disabled, onChange, error, onBlur }: Props): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={`${styles['button-date-picker']} ${
            error && styles['button-date-picker--error']
          }`}
          type='button'
          variant='outline'
          onBlur={onBlur}
        >
          <CalendarIcon className='size-4 mr-2' />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode='single'
          selected={value}
          disabled={disabled}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
export default DatePicker;
