import { z } from 'zod';
import { db } from '@/core/drizzle';
import { and, desc, eq, gte, lt, lte, sql, sum } from 'drizzle-orm';
import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { differenceInDays, parse, subDays } from 'date-fns';
import { fn_accounts, fn_categories, fn_transactions } from '@/core/finance/schemas';
import { calculatePercentageChange, fillMissingDays } from '@/shared/utils';
import { fromDbToSummary } from '@/core/finance/mappers';

const app = new Hono().get(
  '/',
  clerkMiddleware(),
  zValidator(
    'query',
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    try {
      const auth = getAuth(c);
      if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
      const { from, to, accountId } = c.req.valid('query');

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
      const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      const [currentPeriod] = await fetchFinancialData({
        userId: auth.userId,
        accountId,
        endDate,
        startDate,
      });
      const [lastPeriod] = await fetchFinancialData({
        userId: auth.userId,
        accountId,
        endDate: lastPeriodEnd,
        startDate: lastPeriodStart,
      });

      const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
      const expenseChange = calculatePercentageChange(currentPeriod.expenses, lastPeriod.expenses);
      const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining
      );

      const categoriesValues = await db
        .select({
          name: fn_categories.name,
          value: sql`SUM(ABS(${fn_transactions.amount}))`.mapWith(Number),
        })
        .from(fn_transactions)
        .innerJoin(fn_accounts, eq(fn_transactions.accountId, fn_accounts.id))
        .innerJoin(fn_categories, eq(fn_transactions.categoryId, fn_categories.id))
        .where(
          and(
            accountId ? eq(fn_transactions.accountId, accountId) : undefined,
            eq(fn_accounts.userId, auth.userId),
            lt(fn_transactions.amount, 0),
            gte(fn_transactions.date, startDate),
            lte(fn_transactions.date, endDate)
          )
        )
        .groupBy(fn_categories.name)
        .orderBy(desc(sql`SUM(ABS(${fn_transactions.amount}))`));

      const topCategories = categoriesValues.slice(0, 3);
      const otherCategories = categoriesValues.slice(3);
      const otherSum = otherCategories.reduce((acc, cv) => acc + cv.value, 0);
      const categories = topCategories;
      if (otherCategories.length > 0) categories.push({ name: 'Other', value: otherSum });

      const activeDays = await db
        .select({
          date: fn_transactions.date,
          income:
            sql`SUM(CASE WHEN ${fn_transactions.amount} >= 0 THEN ${fn_transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          expenses:
            sql`SUM(CASE WHEN ${fn_transactions.amount} < 0 THEN ABS(${fn_transactions.amount}) ELSE 0 END)`.mapWith(
              Number
            ),
        })
        .from(fn_transactions)
        .innerJoin(fn_accounts, eq(fn_transactions.accountId, fn_accounts.id))
        .where(
          and(
            accountId ? eq(fn_transactions.accountId, accountId) : undefined,
            eq(fn_accounts.userId, auth.userId),
            gte(fn_transactions.date, startDate),
            lte(fn_transactions.date, endDate)
          )
        )
        .groupBy(fn_transactions.date)
        .orderBy(fn_transactions.date);

      const days = fillMissingDays(activeDays, startDate, endDate);

      const summaryMapper = fromDbToSummary({
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expenseChange,
        days,
        categories,
      });

      return c.json(
        {
          data: summaryMapper,
        },
        200
      );
    } catch (error) {
      return c.json({ error: 'Internal error server' }, 500);
    }
  }
);

async function fetchFinancialData({
  userId,
  accountId,
  endDate,
  startDate,
}: {
  userId: string;
  accountId?: string;
  startDate: Date;
  endDate: Date;
}) {
  const result = await db
    .select({
      income:
        sql`SUM(CASE WHEN ${fn_transactions.amount} >= 0 THEN ${fn_transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      expenses:
        sql`SUM(CASE WHEN ${fn_transactions.amount} < 0 THEN ${fn_transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      remaining: sum(fn_transactions.amount).mapWith(Number),
    })
    .from(fn_transactions)
    .innerJoin(fn_accounts, eq(fn_transactions.accountId, fn_accounts.id))
    .where(
      and(
        accountId ? eq(fn_transactions.accountId, accountId) : undefined,
        eq(fn_accounts.userId, userId),
        gte(fn_transactions.date, startDate),
        lte(fn_transactions.date, endDate)
      )
    );
  return result;
}

export default app;
