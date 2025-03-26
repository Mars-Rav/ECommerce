import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/productsSchema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // password: process.env.DATABASE_PASSWORD,
  },
  verbose: true,
  strict: true,
});
