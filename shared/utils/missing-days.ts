import { eachDayOfInterval, isSameDay } from 'date-fns';

type ActiveDays = {
  date: Date;
  income: number;
  expenses: number;
};

export function fillMissingDays(activeDays: ActiveDays[], startDate: Date, endDate: Date) {
  if (activeDays.length === 0) return [];
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((item) => isSameDay(item.date, day));
    if (found) return found;
    return {
      date: day,
      income: 0,
      expenses: 0,
    };
  });
  return transactionsByDay;
}
