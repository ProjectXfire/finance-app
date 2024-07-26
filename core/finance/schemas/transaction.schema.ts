import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { TABLES } from '../constants';
import { fn_accounts } from './account.schema';
import { fn_categories } from './category.schema';

export const fn_transactions = pgTable(TABLES['transactions'], {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  payee: text('payee').notNull(),
  notes: text('notes').notNull(),
  date: timestamp('data', { mode: 'date' }).notNull(),
  accountId: text('account_id')
    .references(() => fn_accounts.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: text('category_id').references(() => fn_categories.id, { onDelete: 'set null' }),
});

export const transactionsRelations = relations(fn_transactions, ({ one }) => ({
  account: one(fn_accounts, {
    fields: [fn_transactions.accountId],
    references: [fn_accounts.id],
  }),
  category: one(fn_categories, {
    fields: [fn_transactions.categoryId],
    references: [fn_categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(fn_transactions, {
  date: z.coerce.date(),
});
