import { query } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
  return rows[0];
};

export const findUserById = async (id) => {
  const { rows } = await query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0];
};

export const createUser = async ({ name, email, passwordHash }) => {
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email.toLowerCase(), passwordHash]
  );
  return rows[0];
};
