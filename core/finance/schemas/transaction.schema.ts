import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { accounts } from './account.schema';
import { categories } from './category.schema';
import { TABLES } from '../constants';

export const transactions = pgTable(TABLES['transactions'], {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  payee: text('payee').notNull(),
  notes: text('notes').notNull(),
  date: timestamp('data', { mode: 'date' }).notNull(),
  accountId: text('account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  [TABLES['accounts']]: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  [TABLES['categories']]: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, { date: z.coerce.date() });
