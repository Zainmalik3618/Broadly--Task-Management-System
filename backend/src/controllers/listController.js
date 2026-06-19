import { createList, deleteList, updateList } from "../models/listModel.js";

export const addList = async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) return res.status(400).json({ message: "List title is required" });
  const list = await createList(req.params.boardId, req.user.id, title);
  if (!list) return res.status(404).json({ message: "Board not found" });
  res.status(201).json({ list: { ...list, tasks: [] } });
};

export const editList = async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) return res.status(400).json({ message: "List title is required" });
  const list = await updateList(req.params.id, req.user.id, title);
  if (!list) return res.status(404).json({ message: "List not found" });
  res.json({ list });
};

export const removeList = async (req, res) => {
  if (!(await deleteList(req.params.id, req.user.id))) {
    return res.status(404).json({ message: "List not found" });
  }
  res.status(204).send();
};
