import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const accounts = pgTable('fn_accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);
