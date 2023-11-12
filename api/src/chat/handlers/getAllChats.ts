import { pool } from "../../db";

async function getAllChatsApi() {
  const query = `SELECT * FROM chat.chats`;
  const results = await pool.execute(query);
  const [data] = results;
  return data;
}

export { getAllChatsApi };
