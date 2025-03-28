import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { userTable } from "./usersSchema";
import { productsTable } from "./productsSchema";
import { z } from "zod";

// @ts-ignore
export const ordersTable = pgTable("orders", {
  id: integer().notNull().generatedAlwaysAsIdentity().primaryKey().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  status: varchar({ length: 255 }).notNull().default("New"),
  userId: integer().references(() => userTable.id),
});

// @ts-ignore
export const orderItems = pgTable("orderItems", {
  id: integer().generatedAlwaysAsIdentity().notNull().unique(),
  orderId: integer()
    // @ts-ignore
    .references(() => ordersTable.id)
    .notNull(),
  productId: integer()
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer().default(1).notNull(),
  price: doublePrecision().notNull(),
});

export const ordersInsertSchema = createInsertSchema(ordersTable).omit({
  createdAt: true,
  status: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  orderId: true,
  price: true,
});

export const insertOrderWithItemsSchema = z.object({
  order: ordersInsertSchema,
  items: z.array(insertOrderItemSchema),
});

export const ordersUpdateSchema = createUpdateSchema(ordersTable);
