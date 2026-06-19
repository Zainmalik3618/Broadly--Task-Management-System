import { createTask, deleteTask, moveTask, updateTask } from "../models/taskModel.js";

const normalizeTask = (body) => ({
  title: body.title?.trim(),
  description: body.description?.trim() || "",
  dueDate: body.dueDate || null,
  priority: body.priority || "Medium"
});

const validateTask = (data) => {
  if (!data.title) return "Task title is required";
  if (!["Low", "Medium", "High"].includes(data.priority)) return "Invalid priority";
  return null;
};

export const addTask = async (req, res) => {
  const data = normalizeTask(req.body);
  const error = validateTask(data);
  if (error) return res.status(400).json({ message: error });
  const task = await createTask(req.params.listId, req.user.id, data);
  if (!task) return res.status(404).json({ message: "List not found" });
  res.status(201).json({ task });
};

export const editTask = async (req, res) => {
  const data = normalizeTask(req.body);
  const error = validateTask(data);
  if (error) return res.status(400).json({ message: error });
  const task = await updateTask(req.params.id, req.user.id, data);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ task });
};

export const removeTask = async (req, res) => {
  if (!(await deleteTask(req.params.id, req.user.id))) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(204).send();
};

export const moveTaskCard = async (req, res) => {
  const targetListId = Number(req.body.listId);
  const position = Number(req.body.position);
  if (!Number.isInteger(targetListId) || !Number.isInteger(position) || position < 0) {
    return res.status(400).json({ message: "Valid listId and position are required" });
  }
  const board = await moveTask(req.params.id, req.user.id, targetListId, position);
  if (!board) return res.status(404).json({ message: "Task not found" });
  res.json({ board });
};
