import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import {
  integer,
  pgTable,
  varchar,
  text,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const productsTable = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  quantity: integer().default(0),
});

export const insertProductSchema = createInsertSchema(productsTable);
export const updateProductsSchema = createUpdateSchema(productsTable);
