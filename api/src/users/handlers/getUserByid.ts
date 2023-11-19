import { pool } from "../../db";



export default async function getUserById(userId:string) {
    const query = "SELECT * FROM chat.users WHERE id = ?;"
    const results = await pool.execute(query,[userId]);
    const [data] = results;
    return data;
    
}