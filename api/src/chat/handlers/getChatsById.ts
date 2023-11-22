import { pool } from "../../db";

async function getChatsById(fid:number) {
  const query = `SELECT * FROM chat.chats WHERE firstUserId = ? `;//AND secondUserId = ?
  const results = await pool.execute(query, [fid] );
  const [data] = results;
  return data;
}

export { getChatsById };
