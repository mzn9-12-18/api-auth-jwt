import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", verifyToken, getCategories);
router.get("/:id", verifyToken, getCategory);
router.post("/", verifyToken, postCategory);
router.put("/:id", verifyToken, putCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;