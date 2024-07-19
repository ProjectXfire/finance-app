import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const categories = pgTable('fn_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});

export const insertCategorySchema = createInsertSchema(categories);
