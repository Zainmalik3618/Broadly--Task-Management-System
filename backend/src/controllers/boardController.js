import {
  createBoard,
  deleteBoard,
  getBoardDetails,
  getBoardsByUser,
  updateBoard
} from "../models/boardModel.js";

export const listBoards = async (req, res) => {
  res.json({ boards: await getBoardsByUser(req.user.id) });
};

export const getBoard = async (req, res) => {
  const board = await getBoardDetails(req.params.id, req.user.id);
  if (!board) return res.status(404).json({ message: "Board not found" });
  res.json({ board });
};

export const addBoard = async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) return res.status(400).json({ message: "Board title is required" });
  res.status(201).json({ board: await createBoard(req.user.id, title) });
};

export const editBoard = async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) return res.status(400).json({ message: "Board title is required" });
  const board = await updateBoard(req.params.id, req.user.id, title);
  if (!board) return res.status(404).json({ message: "Board not found" });
  res.json({ board });
};

export const removeBoard = async (req, res) => {
  if (!(await deleteBoard(req.params.id, req.user.id))) {
    return res.status(404).json({ message: "Board not found" });
  }
  res.status(204).send();
};
