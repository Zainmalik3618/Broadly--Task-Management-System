import { Router } from "express";
import {
  addBoard,
  editBoard,
  getBoard,
  listBoards,
  removeBoard
} from "../controllers/boardController.js";
import { addList } from "../controllers/listController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
router.route("/").get(asyncHandler(listBoards)).post(asyncHandler(addBoard));
router.route("/:id").get(asyncHandler(getBoard)).put(asyncHandler(editBoard)).delete(asyncHandler(removeBoard));
router.post("/:boardId/lists", asyncHandler(addList));
export default router;
