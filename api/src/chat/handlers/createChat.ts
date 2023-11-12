import { pool } from "../../db";

async function createNewChatApi(firstUserId: string, secondUserId: string) {
  const query =
    "INSERT INTO chat.chats (firstUserId, secondUserId) VALUES (?, ?)";
  const results = await pool.execute(query, [secondUserId, secondUserId]);
  const [data] = results;
  return data;
}

export { createNewChatApi };
