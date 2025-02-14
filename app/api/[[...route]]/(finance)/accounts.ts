import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { db } from '@/core/drizzle';
import { and, eq, inArray } from 'drizzle-orm';
import { fromDbToAccount } from '@/core/finance/mappers';
import { fn_accounts, insertAccountSchema } from '@/core/finance/schemas';

const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    try {
      const auth = getAuth(c);
      if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
      const data = await db
        .select({ id: fn_accounts.id, name: fn_accounts.name })
        .from(fn_accounts)
        .where(eq(fn_accounts.userId, auth.userId));
      const accountsMapper = data.map((a) => fromDbToAccount(a));
      return c.json({ data: accountsMapper }, 200);
    } catch (error) {
      return c.json({ error: 'Internal error server' }, 500);
    }
  })
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
          .select({ id: fn_accounts.id, name: fn_accounts.name })
          .from(fn_accounts)
          .where(and(eq(fn_accounts.userId, auth.userId), eq(fn_accounts.id, id)));
        if (data.length === 0) return c.json({ error: 'Not found' }, 400);
        const accountMapper = fromDbToAccount(data[0]);
        return c.json({ data: accountMapper }, 200);
      } catch (error) {
        return c.json({ error: 'Error on get account' }, 500);
      }
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      try {
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');
        const [data] = await db
          .insert(fn_accounts)
          .values({
            id: createId(),
            userId: auth.userId,
            ...values,
          })
          .returning();
        const accountMapper = fromDbToAccount(data);
        return c.json({ data: accountMapper }, 200);
      } catch (error) {
        return c.json({ error: 'Error on create an account' }, 500);
      }
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        if (!id) return c.json({ error: 'Missing Id' }, 400);
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');
        const data = await db
          .update(fn_accounts)
          .set(values)
          .where(and(eq(fn_accounts.userId, auth.userId), eq(fn_accounts.id, id)))
          .returning();
        if (data.length === 0) return c.json({ error: 'Not found' }, 400);
        const accountMapper = fromDbToAccount(data[0]);
        return c.json({ data: accountMapper }, 200);
      } catch (error) {
        return c.json({ error: 'Error on update account' }, 500);
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
        await db
          .delete(fn_accounts)
          .where(and(eq(fn_accounts.userId, auth.userId), inArray(fn_accounts.id, values.ids)))
          .returning({ id: fn_accounts.id });
        return c.json({ data: [] }, 200);
      } catch (error) {
        return c.json({ error: 'Error delete account(s)' }, 500);
      }
    }
  );

export default app;
