import { pool } from "../../db";

interface IMessage {
  name: string;
  text: string;
  group_chat_id: number;
  time: string;
}
export default async function postNewGroupMessage(messagePack: IMessage) {
  const { name, group_chat_id, text, time } = messagePack;
  const query = `
    INSERT INTO chat.group_chat_messages (name, text, group_chat_id, time)
    VALUES (?, ?, ?, ?);
  `;
  const results = await pool.execute(query, [name, text, group_chat_id, time]);
  const [data] = results;
  return data;
}
