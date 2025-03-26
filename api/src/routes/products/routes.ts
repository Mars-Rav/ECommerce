import { Router } from "express";
import { list, details, create, remove, update } from "./controller";

const router = Router();

router.get("/", list);

router.get("/:id", details);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;
