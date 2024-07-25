'use client';

import styles from './Form.module.css';
import { Info, MinusCircle, PlusCircle } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '..';

interface Props {
  value: string;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

function CustomCurrencyInput({ value, onChange, disabled, placeholder }: Props): JSX.Element {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    const newValue = parseFloat(value) * -1;
    onChange(newValue);
  };

  const onValueChange = (value: string | undefined) => {
    if (value === '0' || value === '' || value === undefined) {
      onChange(0);
    } else {
      onChange(parseFloat(value));
    }
  };

  return (
    <>
      <div className={styles['currency-input-container']}>
        <div className={styles['currency-focus']} />
        <div className={styles['currency-input']}>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button type='button' onClick={onReverseValue}>
                  {!parsedValue && <Info className={styles['currency-input__icon']} />}
                  {isIncome && (
                    <PlusCircle
                      className={`${styles['currency-input__icon']} ${styles['currency-input__icon--plus']}`}
                    />
                  )}
                  {isExpense && (
                    <MinusCircle
                      className={`${styles['currency-input__icon']} ${styles['currency-input__icon--minus']}`}
                    />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Use [+] for income and [-] for expenses</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CurrencyInput
            className={styles['currency-input__field']}
            prefix='$'
            value={value}
            placeholder={placeholder}
            decimalsLimit={2}
            decimalScale={2}
            decimalSeparator='.'
            groupSeparator=','
            onValueChange={onValueChange}
            disabled={disabled}
          />
        </div>
      </div>
      <p className={styles['currency-info']}>
        {isIncome && 'This will count as income'}
        {isExpense && 'This will count as expense'}
      </p>
    </>
  );
}
export default CustomCurrencyInput;
