import { verifyToken } from "../middlewares/authMiddleware.js";
import Router from "express";
import {
  deleteTask,
  getTasks,
  postTask,
  putTask,
} from "../controllers/taskControllers.js";

const router = Router();

router.get("/", verifyToken, getTasks);
router.post("/", verifyToken, postTask);
router.put("/:id", verifyToken, putTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;
