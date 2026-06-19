import { pool, query } from "../config/db.js";
import { getBoardDetails } from "./boardModel.js";

const getOwnedTask = async (taskId, userId, client = { query }) => {
  const { rows } = await client.query(
    `SELECT t.* FROM tasks t
     JOIN boards b ON b.id = t.board_id
     WHERE t.id = $1 AND b.user_id = $2`,
    [taskId, userId]
  );
  return rows[0];
};

export const createTask = async (listId, userId, data) => {
  const { rows: lists } = await query(
    `SELECT l.* FROM lists l JOIN boards b ON b.id = l.board_id
     WHERE l.id = $1 AND b.user_id = $2`,
    [listId, userId]
  );
  const list = lists[0];
  if (!list) return null;

  const { rows } = await query(
    `INSERT INTO tasks
       (list_id, board_id, title, description, due_date, priority, position)
     VALUES
       ($1, $2, $3, $4, $5, $6,
        (SELECT COALESCE(MAX(position), -1) + 1 FROM tasks WHERE list_id = $1))
     RETURNING id, list_id, board_id, title, description,
       due_date::text AS due_date, priority, position, created_at, updated_at`,
    [listId, list.board_id, data.title, data.description, data.dueDate, data.priority]
  );
  return rows[0];
};

export const updateTask = async (taskId, userId, data) => {
  const { rows } = await query(
    `UPDATE tasks t SET
       title = $1, description = $2, due_date = $3, priority = $4, updated_at = NOW()
     FROM boards b
     WHERE t.id = $5 AND t.board_id = b.id AND b.user_id = $6
     RETURNING t.id, t.list_id, t.board_id, t.title, t.description,
       t.due_date::text AS due_date, t.priority, t.position, t.created_at, t.updated_at`,
    [data.title, data.description, data.dueDate, data.priority, taskId, userId]
  );
  return rows[0];
};

export const deleteTask = async (taskId, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const task = await getOwnedTask(taskId, userId, client);
    if (!task) {
      await client.query("ROLLBACK");
      return false;
    }
    await client.query("DELETE FROM tasks WHERE id = $1", [taskId]);
    await client.query(
      "UPDATE tasks SET position = position - 1 WHERE list_id = $1 AND position > $2",
      [task.list_id, task.position]
    );
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const moveTask = async (taskId, userId, targetListId, targetPosition) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const task = await getOwnedTask(taskId, userId, client);
    if (!task) {
      await client.query("ROLLBACK");
      return null;
    }

    const { rows: targetRows } = await client.query(
      `SELECT l.* FROM lists l JOIN boards b ON b.id = l.board_id
       WHERE l.id = $1 AND l.board_id = $2 AND b.user_id = $3`,
      [targetListId, task.board_id, userId]
    );
    if (!targetRows[0]) {
      const error = new Error("Target list not found on this board");
      error.status = 400;
      throw error;
    }

    const { rows: countRows } = await client.query(
      "SELECT COUNT(*)::int AS count FROM tasks WHERE list_id = $1 AND id <> $2",
      [targetListId, taskId]
    );
    const normalizedPosition = Math.max(0, Math.min(Number(targetPosition), countRows[0].count));

    await client.query(
      "UPDATE tasks SET position = position - 1 WHERE list_id = $1 AND position > $2",
      [task.list_id, task.position]
    );
    await client.query(
      "UPDATE tasks SET position = position + 1 WHERE list_id = $1 AND position >= $2 AND id <> $3",
      [targetListId, normalizedPosition, taskId]
    );
    await client.query(
      `UPDATE tasks SET list_id = $1, position = $2, updated_at = NOW()
       WHERE id = $3`,
      [targetListId, normalizedPosition, taskId]
    );

    const board = await getBoardDetails(task.board_id, userId, client);
    await client.query("COMMIT");
    return board;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
