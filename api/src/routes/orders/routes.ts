import { Router } from "express";

import { validateData } from "../../middleware/validation.js";
import { authenticate } from "../../middleware/authentication.js";
import { insertOrderWithItemsSchema } from "../../db/ordersSchema.js";
import { list, details, create, update, remove } from "./controller.js";

const router = Router();

router.get("/", authenticate, list);
router.get("/:id", details);
router.post(
  "/",
  authenticate,
  validateData(insertOrderWithItemsSchema),
  create
);
router.put("/:id", validateData(insertOrderWithItemsSchema), update);
router.delete("/:id", remove);

export default router;
