import { pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { fn_transactions } from './transaction.schema';
import { TABLES } from '../constants';

export const fn_accounts = pgTable(TABLES['accounts'], {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});

export const accountsRelations = relations(fn_accounts, ({ many }) => ({
  [TABLES['transactions']]: many(fn_transactions),
}));

export const insertAccountSchema = createInsertSchema(fn_accounts);
