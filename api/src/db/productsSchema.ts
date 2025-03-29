import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import {
  integer,
  pgTable,
  varchar,
  text,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { userTable } from "./usersSchema";

export const productsTable = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  quantity: integer().default(0),
  seller: integer()
    .references(() => userTable.id)
    .notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  seller: true,
});
export const updateProductsSchema = createUpdateSchema(productsTable);
