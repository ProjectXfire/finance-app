export interface FinanceInfo {
  date: string;
  income: number;
  expenses: number;
}

export interface CategoryInfo {
  name: string;
  value: number;
}

export interface Summary {
  remainingAmount: number;
  remainingChange: number;
  incomeAmount: number;
  incomeChange: number;
  expensesAmount: number;
  expenseChange: number;
  days: FinanceInfo[];
  categories: CategoryInfo[];
}
