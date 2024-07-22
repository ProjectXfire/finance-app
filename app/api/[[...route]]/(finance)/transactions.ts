import { z } from 'zod';
import { parse } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { db } from '@/core/drizzle';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { fromDbToTransaction } from '@/core/finance/mappers';
import {
  accounts,
  categories,
  insertTransactionSchema,
  transactions,
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
        if (!to || !from || !accountId) return c.json({ error: 'Missing params' }, 400);

        const startDate = parse(from, 'yyyy-MM-dd', new Date());
        const endDate = parse(to, 'yyyy-MM-dd', new Date());

        const data = await db
          .select({
            id: transactions.id,
            payee: transactions.payee,
            amount: transactions.amount,
            notes: transactions.notes,
            data: transactions.date,
            category: categories.name,
            categoryId: transactions.categoryId,
            account: accounts.name,
            accountId: transactions.accountId,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .leftJoin(categories, eq(transactions.categoryId, categories.id))
          .where(
            and(
              eq(transactions.accountId, accountId),
              eq(accounts.userId, auth.userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate)
            )
          )
          .orderBy(desc(transactions.date));
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
            id: transactions.id,
            payee: transactions.payee,
            amount: transactions.amount,
            notes: transactions.notes,
            date: transactions.date,
            category: categories.name,
            categoryId: transactions.categoryId,
            account: accounts.name,
            accountId: transactions.accountId,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));
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
          .insert(transactions)
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
            .select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))
        );

        const data = await db
          .with(transactionToUpdate)
          .update(transactions)
          .set(values)
          .where(inArray(transactions.id, sql`(select id from ${transactionToUpdate})`))
          .returning();
        if (data.length === 0) return c.json({ error: 'Not found' }, 400);
        const categoryMapper = fromDbToTransaction(data[0]);
        return c.json({ data: categoryMapper }, 200);
      } catch (error) {
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
          .insert(transactions)
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
            .select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(inArray(transactions.id, values.ids), eq(accounts.userId, auth.userId)))
        );
        const idsDeleted = await db
          .with(transactionsToDelete)
          .delete(transactions)
          .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
          .returning({ id: transactions.id });

        return c.json({ data: idsDeleted }, 200);
      } catch (error) {
        return c.json({ error: 'Error delete account(s)' }, 500);
      }
    }
  );

export default app;
