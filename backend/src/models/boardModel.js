import { query } from "../config/db.js";

export const getBoardsByUser = async (userId) => {
  const { rows } = await query(
    `SELECT b.*, COUNT(DISTINCT l.id)::int AS list_count,
       COUNT(DISTINCT t.id)::int AS task_count
     FROM boards b
     LEFT JOIN lists l ON l.board_id = b.id
     LEFT JOIN tasks t ON t.board_id = b.id
     WHERE b.user_id = $1
     GROUP BY b.id
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
};

export const findOwnedBoard = async (boardId, userId, client = { query }) => {
  const { rows } = await client.query(
    "SELECT * FROM boards WHERE id = $1 AND user_id = $2",
    [boardId, userId]
  );
  return rows[0];
};

export const getBoardDetails = async (boardId, userId, client = { query }) => {
  const board = await findOwnedBoard(boardId, userId, client);
  if (!board) return null;

  const { rows: lists } = await client.query(
    "SELECT * FROM lists WHERE board_id = $1 ORDER BY position, id",
    [boardId]
  );
  const { rows: tasks } = await client.query(
    `SELECT id, list_id, board_id, title, description,
       due_date::text AS due_date, priority, position, created_at, updated_at
     FROM tasks
     WHERE board_id = $1
     ORDER BY position, id`,
    [boardId]
  );

  return {
    ...board,
    lists: lists.map((list) => ({
      ...list,
      tasks: tasks.filter((task) => task.list_id === list.id)
    }))
  };
};

export const createBoard = async (userId, title) => {
  const { rows } = await query(
    "INSERT INTO boards (user_id, title) VALUES ($1, $2) RETURNING *",
    [userId, title]
  );
  return rows[0];
};

export const updateBoard = async (boardId, userId, title) => {
  const { rows } = await query(
    "UPDATE boards SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [title, boardId, userId]
  );
  return rows[0];
};

export const deleteBoard = async (boardId, userId) => {
  const { rowCount } = await query(
    "DELETE FROM boards WHERE id = $1 AND user_id = $2",
    [boardId, userId]
  );
  return rowCount > 0;
};
