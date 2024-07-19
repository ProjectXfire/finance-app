import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { db } from '@/core/drizzle';
import { and, eq, inArray } from 'drizzle-orm';
import { fromDbToCategory } from '@/core/finance/mappers';
import { categories, insertCategorySchema } from '@/core/finance/schemas';

const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    try {
      const auth = getAuth(c);
      if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
      const data = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(eq(categories.userId, auth.userId));
      const categoriesMapper = data.map((a) => fromDbToCategory(a));
      return c.json({ data: categoriesMapper }, 200);
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
          .select({ id: categories.id, name: categories.name })
          .from(categories)
          .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)));
        if (data.length === 0) return c.json({ error: 'Not found' }, 400);
        const category = fromDbToCategory(data[0]);
        return c.json({ data: category }, 200);
      } catch (error) {
        return c.json({ error: 'Error on get account' }, 500);
      }
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertCategorySchema.pick({ name: true })),
    async (c) => {
      try {
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');
        const [data] = await db
          .insert(categories)
          .values({
            id: createId(),
            userId: auth.userId,
            ...values,
          })
          .returning();
        const categoryMapper = fromDbToCategory(data);
        return c.json({ data: categoryMapper }, 200);
      } catch (error) {
        return c.json({ error: 'Error on create an account' }, 500);
      }
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertCategorySchema.pick({ name: true })),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        if (!id) return c.json({ error: 'Missing Id' }, 400);
        const auth = getAuth(c);
        if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401);
        const values = c.req.valid('json');
        const data = await db
          .update(categories)
          .set(values)
          .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
          .returning();
        if (data.length === 0) return c.json({ error: 'Not found' }, 400);
        const categoryMapper = fromDbToCategory(data[0]);
        return c.json({ data: categoryMapper }, 200);
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
          .delete(categories)
          .where(and(eq(categories.userId, auth.userId), inArray(categories.id, values.ids)))
          .returning({ id: categories.id });
        return c.json({ data: [] }, 200);
      } catch (error) {
        return c.json({ error: 'Error delete account(s)' }, 500);
      }
    }
  );

export default app;
