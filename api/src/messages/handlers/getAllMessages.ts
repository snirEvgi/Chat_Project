import { pool } from "../../db";



export default async function getAllMessages(chatId:string) {
    const query = "SELECT * FROM chat.messages WHERE chatId = ?;"
    const results = await pool.execute(query,[chatId]);
    const [data] = results;
    return data;
    
}