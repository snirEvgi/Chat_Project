import { pool } from "../../db";

interface IMessage {
  name: string;
  text: string;
  room: number;
  time: string;
}
export default async function postNewMessage(messagePack: IMessage) {
  const { name, room, text, time } = messagePack;
  const nRoom = Number(room);
  const query = `
    INSERT INTO chat.messages (name, text, room, time)
    VALUES (?, ?, ?, ?);
  `;
  const results = await pool.execute(query, [name,  text, room, time]);
  const [data] = results;
  return data;
}