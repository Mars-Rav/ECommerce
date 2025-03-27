import { Router } from "express";
import { list, details, create, remove, update } from "./controller";
import {
  authenticate,
  authenticateRole,
} from "../../middleware/authentication";

import {
  insertProductSchema,
  updateProductsSchema,
} from "../../db/productsSchema";
import { validateData } from "../../middleware/validation";

const router = Router();

router.get("/", list);
router.get("/:id", details);
router.post(
  "/",
  authenticate,
  authenticateRole("seller"),
  validateData(insertProductSchema),
  create
);
router.put(
  "/:id",
  authenticate,
  authenticateRole("seller"),
  validateData(updateProductsSchema),
  update
);
router.delete("/:id", authenticate, authenticateRole("seller"), remove);

export default router;
