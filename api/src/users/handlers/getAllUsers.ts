import { pool } from "../../db";



 async function getAllUsers() {
    const query = "SELECT * FROM chat.users;"
    const results = await pool.execute(query);
    const [data] = results;
    return data;
    
}
export { getAllUsers}