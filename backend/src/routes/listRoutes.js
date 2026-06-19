import { Router } from "express";
import { editList, removeList } from "../controllers/listController.js";
import { addTask } from "../controllers/taskController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
router.route("/:id").put(asyncHandler(editList)).delete(asyncHandler(removeList));
router.post("/:listId/tasks", asyncHandler(addTask));
export default router;
