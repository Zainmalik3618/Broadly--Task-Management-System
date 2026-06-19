import { Router } from "express";
import { editTask, moveTaskCard, removeTask } from "../controllers/taskController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
router.route("/:id").put(asyncHandler(editTask)).delete(asyncHandler(removeTask));
router.patch("/:id/move", asyncHandler(moveTaskCard));
export default router;
