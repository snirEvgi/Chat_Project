import { pool } from "../../db";

interface IMessage {
  senderId: string;
  chatId: string;
  text: string;
}
export default async function postNewMessage(messagePack: IMessage) {
  const { senderId, chatId, text } = messagePack;
  const query = `
    INSERT INTO \`chat\`.\`messages\` (\`senderId\`, \`chatId\`, \`text\`)
    VALUES (?, ?, ?);
  `;
  const results = await pool.execute(query, [senderId, chatId, text]);
  const [data] = results;
  return data;
}
