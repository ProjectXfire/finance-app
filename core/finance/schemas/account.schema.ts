import { pgTable, text } from 'drizzle-orm/pg-core';

export const accounts = pgTable('fn_accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});
