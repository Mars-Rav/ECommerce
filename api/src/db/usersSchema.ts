import { pgTable, integer, varchar, date, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().unique(),
  fullname: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull().default("user"),
  address: text(),
  pfp: varchar({ length: 255 }),
  dob: date(),
});

export const userInsertSchema = createInsertSchema(userTable).omit({
  role: true,
});
export const userLoginSchema = createInsertSchema(userTable).pick({
  email: true,
  password: true,
});
export const userUpdateSchema = createUpdateSchema(userTable);
