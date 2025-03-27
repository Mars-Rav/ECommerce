import { Router } from "express";
import { list, details, create, remove, update, login } from "./controller";
import {
  userInsertSchema,
  userUpdateSchema,
  userLoginSchema,
} from "../../db/usersSchema";
import { validateData } from "../../middleware/validation";
import { authenticate } from "../../middleware/authentication";

const router = Router();

router.get("/", list);
router.get("/:id", details);
router.post("/register", validateData(userInsertSchema), create);
router.post("/login", validateData(userLoginSchema), login);
router.delete("/:id", authenticate, remove);
router.put("/:id", authenticate, validateData(userUpdateSchema), update);

export default router;
