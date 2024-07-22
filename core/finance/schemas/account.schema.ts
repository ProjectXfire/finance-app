import { pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from './transaction.schema';
import { TABLES } from '../constants';

export const accounts = pgTable(TABLES['accounts'], {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  [TABLES['transactions']]: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);
