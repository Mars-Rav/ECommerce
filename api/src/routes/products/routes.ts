import { Router } from "express";
import { list, details, create, remove, update } from "./controller";

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { productsTable } from "../../db/productsSchema";
import { validateData } from "../../middleware/validation";

const router = Router();

const insertProductSchema = createInsertSchema(productsTable);
const updateProductsSchema = createUpdateSchema(productsTable);

router.get("/", list);
router.get("/:id", details);
router.post("/", validateData(insertProductSchema), create);
router.put("/:id", validateData(updateProductsSchema), update);
router.delete("/:id", remove);

export default router;
