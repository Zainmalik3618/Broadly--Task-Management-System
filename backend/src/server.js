import app from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

const start = async () => {
  await pool.query("SELECT 1");
  app.listen(env.port, () => {
    console.log(`API running at http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error("Unable to start server:", error.message);
  process.exit(1);
});
