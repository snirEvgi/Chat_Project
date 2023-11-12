import { pool } from "../../db";

async function getChatApi(chatId: number) {
  const query = `SELECT * FROM chat.chats where id = ?;`;
  const results = await pool.execute(query, [chatId]);
  const [data] = results;
  return data;
}

export { getChatApi };
