import { pool } from "../../db";

async function getAllGroupChatsByIdApi(id: number) {
  const query = `
    SELECT
        gc.group_chat_id, gc.chat_name
    FROM
        group_chats gc
    JOIN
        group_chat_members gcm ON gc.group_chat_id = gcm.group_chat_id
    WHERE
        gcm.user_id = ?;
  `;
  const results = await pool.execute(query, [id]);
  const [data] = results;
  return data;
}

export { getAllGroupChatsByIdApi };
