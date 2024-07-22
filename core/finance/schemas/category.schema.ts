import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from './transaction.schema';
import { TABLES } from '../constants';

export const categories = pgTable(TABLES['categories'], {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  [TABLES['transactions']]: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);
