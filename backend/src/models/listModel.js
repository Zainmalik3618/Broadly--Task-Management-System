import { pool, query } from "../config/db.js";
import { findOwnedBoard } from "./boardModel.js";

export const createList = async (boardId, userId, title) => {
  const board = await findOwnedBoard(boardId, userId);
  if (!board) return null;

  const { rows } = await query(
    `INSERT INTO lists (board_id, title, position)
     VALUES ($1, $2, (SELECT COALESCE(MAX(position), -1) + 1 FROM lists WHERE board_id = $1))
     RETURNING *`,
    [boardId, title]
  );
  return rows[0];
};

export const updateList = async (listId, userId, title) => {
  const { rows } = await query(
    `UPDATE lists l SET title = $1
     FROM boards b
     WHERE l.id = $2 AND l.board_id = b.id AND b.user_id = $3
     RETURNING l.*`,
    [title, listId, userId]
  );
  return rows[0];
};

export const deleteList = async (listId, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `DELETE FROM lists l USING boards b
       WHERE l.id = $1 AND l.board_id = b.id AND b.user_id = $2
       RETURNING l.board_id, l.position`,
      [listId, userId]
    );
    if (!rows[0]) {
      await client.query("ROLLBACK");
      return false;
    }
    await client.query(
      "UPDATE lists SET position = position - 1 WHERE board_id = $1 AND position > $2",
      [rows[0].board_id, rows[0].position]
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
