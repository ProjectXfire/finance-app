import { z } from 'zod';
import { parse, subDays } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { db } from '@/core/drizzle';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { fromDbToTransaction } from '@/core/finance/mappers';
import {
  fn_accounts,
  fn_categories,
  insertTransactionSchema,
  fn_transactions,
} from '@/core/finance/schemas';

const app = new Hono()
  .get(
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

        const { to, from, accountId } = c.req.valid('query');

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
        const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

        const data = await db
          .select({
            id: fn_transactions.id,
            payee: fn_transactions.payee,
            amount: fn_transactions.amount,
            notes: fn_transactions.notes,
            date: fn_transactions.date,
            category: fn_categories.name,
            categoryId: fn_transactions.categoryId,
            account: fn_accounts.name,
            accountId: fn_transactions.accountId,
          })
          .from(fn_transactions)
          .innerJoin(fn_accounts, eq(fn_transactions.accountId, fn_accounts.id))
          .leftJoin(fn_categories, eq(fn_transactions.categoryId, fn_categories.id))
          .where(
            and(
              accountId ? eq(fn_transactions.accountId, accountId) : undefined,
              eq(fn_accounts.userId, auth.userId),
              gte(fn_transactions.date, startDate),
              lte(fn_transactions.date, endDate)
            )
          )
          .orderBy(desc(fn_transactions.date));
        const transactionsMapper = data.map((a) => fromDbToTransaction(a));
        return c.json({ data: transactionsMapper }, 200);
      } catch (error) {
        return c.json({ error: 'Internal error server' }, 500);
      }
    }
  )
  .get(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        if (!id) return c.json({ error: 'Missing Id' }, 400);
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const data = await db
          .select({
            id: fn_transactions.id,
            payee: fn_transactions.payee,
            amount: fn_transactions.amount,
            notes: fn_transactions.notes,
            date: fn_transactions.date,
            category: fn_categories.name,
            categoryId: fn_transactions.categoryId,
            account: fn_accounts.name,
            accountId: fn_transactions.accountId,
          })
          .from(fn_transactions)
          .innerJoin(fn_accounts, eq(fn_transactions.accountId, fn_accounts.id))
          .where(and(eq(fn_transactions.id, id), eq(fn_accounts.userId, auth.userId)));
        if (data.length === 0) return c.json({ error: 'Not found' }, 400);
        const transaction = fromDbToTransaction(data[0]);
        return c.json({ data: transaction }, 200);
      } catch (error) {
        return c.json({ error: 'Error on get trnsaction' }, 500);
      }
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertTransactionSchema.omit({ id: true })),
    async (c) => {
      try {
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');
        const [data] = await db
          .insert(fn_transactions)
          .values({
            id: createId(),
            ...values,
          })
          .returning();
        const transactionMapper = fromDbToTransaction(data);
        return c.json({ data: transactionMapper }, 200);
      } catch (error) {
        return c.json({ error: 'Error on create a transaction' }, 500);
      }
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertTransactionSchema.omit({ id: true })),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        if (!id) return c.json({ error: 'Missing Id' }, 400);
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');

        const transactionToUpdate = db.$with('transaction_to_update').as(
          db
            .select({ id: fn_transactions.id })
            .from(fn_transactions)
            .innerJoin(fn_accounts, eq(fn_transactions.accountId, fn_accounts.id))
            .where(and(eq(fn_accounts.userId, auth.userId), eq(fn_transactions.id, id)))
        );

        const data = await db
          .with(transactionToUpdate)
          .update(fn_transactions)
          .set(values)
          .where(inArray(fn_transactions.id, sql`(select id from ${transactionToUpdate})`))
          .returning();
        if (data.length === 0) return c.json({ error: 'Not found' }, 400);
        const categoryMapper = fromDbToTransaction(data[0]);
        return c.json({ data: categoryMapper }, 200);
      } catch (error) {
        console.log(error);
        return c.json({ error: 'Error on update account' }, 500);
      }
    }
  )
  .post(
    '/bulk-create',
    clerkMiddleware(),
    zValidator('json', z.array(insertTransactionSchema.omit({ id: true }))),
    async (c) => {
      try {
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');
        if (values.length === 0) return c.json({ error: 'Empty values' }, 400);
        const data = await db
          .insert(fn_transactions)
          .values(values.map((v) => ({ id: createId(), ...v })))
          .returning();
        const transactionsMapper = data.map((d) => fromDbToTransaction(d));
        return c.json({ data: transactionsMapper }, 200);
      } catch (error) {
        return c.json({ error: 'Error on create the transactions' }, 500);
      }
    }
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator('json', z.object({ ids: z.array(z.string()) })),
    async (c) => {
      try {
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');
        const transactionsToDelete = db.$with('transactions_to_delete').as(
          db
            .select({ id: fn_transactions.id })
            .from(fn_transactions)
            .innerJoin(fn_accounts, eq(fn_transactions.accountId, fn_accounts.id))
            .where(
              and(inArray(fn_transactions.id, values.ids), eq(fn_accounts.userId, auth.userId))
            )
        );
        const idsDeleted = await db
          .with(transactionsToDelete)
          .delete(fn_transactions)
          .where(inArray(fn_transactions.id, sql`(select id from ${transactionsToDelete})`))
          .returning({ id: fn_transactions.id });

        return c.json({ data: idsDeleted }, 200);
      } catch (error) {
        return c.json({ error: 'Error delete account(s)' }, 500);
      }
    }
  );

export default app;
