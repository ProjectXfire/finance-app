import type { Summary } from '../models';
import { convertAmountFromMiliunits } from '@/shared/utils';

export function fromDbToSummary(obj: { [key: string]: any }): Summary {
  const {
    remainingAmount,
    remainingChange,
    incomeAmount,
    incomeChange,
    expensesAmount,
    expenseChange,
    categories,
    days,
  } = obj;

  const transaction: Summary = {
    remainingAmount: convertAmountFromMiliunits(remainingAmount),
    remainingChange,
    incomeAmount: convertAmountFromMiliunits(incomeAmount),
    incomeChange,
    expensesAmount: convertAmountFromMiliunits(expensesAmount),
    expenseChange,
    categories: categories.map((item: any) => ({
      ...item,
      value: convertAmountFromMiliunits(item.value),
    })),
    days: days.map((item: any) => ({
      ...item,
      income: convertAmountFromMiliunits(item.income),
      expenses: convertAmountFromMiliunits(item.expenses),
    })),
  };
  return transaction;
}
