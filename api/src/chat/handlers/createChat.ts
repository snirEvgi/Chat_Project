import { pool } from "../../db";
interface IChat {
  firstUserId: number;
  secondUserId: number;
  firstUserName: string;
  secondUserName: string;
}
async function createNewChatApi(chat: IChat) {
  const { firstUserId, secondUserId, firstUserName, secondUserName } = chat;
  const query =
    "INSERT INTO chat.chats (firstUserId, secondUserId, firstUserName, secondUserName) VALUES (?, ?, ?, ?)";
  const results = await pool.execute(query, [
    firstUserId,
    secondUserId,
    firstUserName,
    secondUserName,
  ]);
  const [data] = results;
  return data;
}

export { createNewChatApi };
