import { Context } from 'hono';
import { getAuth } from '@hono/clerk-auth';
import { eq } from 'drizzle-orm';
import { db } from '@/core/drizzle';
import { accounts } from '../../schemas';
import { fromDbToAccount } from '../../mappers';

export async function getAccounts(c: Context<{}, '/', {}>) {
  try {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ data: [], error: 'Unauthorized' }, 401);
    const data = await db
      .select({ id: accounts.id, name: accounts.id })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));
    const accountsMapper = data.map((a) => fromDbToAccount(a));
    return c.json({ error: null, data: accountsMapper }, 200);
  } catch (error) {
    return c.json({ error: 'Internal error server', data: [] }, 500);
  }
}
