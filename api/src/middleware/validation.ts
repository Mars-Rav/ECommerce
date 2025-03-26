import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import _ from "lodash";
import { productsTable } from "../db/productsSchema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

const insertProductSchema = createInsertSchema(productsTable);
const updateProductsSchema = createUpdateSchema(productsTable);

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      req.cleanBody = _.pick(req.body, Object.keys(insertProductSchema.shape));
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json({ error: "Invalid Data", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error." });
      }
    }
  };
}
