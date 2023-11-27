import { pool } from "../../db";



export default async function getAllGroupMessages(chatId:string) {
    const query = "SELECT * FROM chat.group_chat_messages WHERE group_chat_id = ?;"
    const results = await pool.execute(query,[chatId]);
    const [data] = results;
    return data;
    
}