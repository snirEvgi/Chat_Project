import { pool } from "../../../database"
import { ResultSetHeader } from "mysql2"
import { getHashedPassword } from "../signup";


async function updateUserPassword(password: string, id: number): Promise<number> {
    
    
    const hashedPassword = await getHashedPassword(password)
    const query = `
    UPDATE vacations.users 
    SET 
        password = ?,
        hashedPassword = ?,
        salt = ?
    WHERE
        (id = ?) 
    `;

    const result = await pool.execute(query, [password, hashedPassword.password, hashedPassword.salt, id])
    const [data] = result;
    console.log((data as ResultSetHeader).insertId);
    return (data as ResultSetHeader).insertId
}

async function getUserIdAfterAuth(question:string, email:string) {
    if (!question||!email) return new Error("Missing data")
    const query = `
    SELECT 
    id
FROM
    vacations.users
WHERE
    question = ?
        AND email = ?;
      `;
    const results = await pool.execute(query,[email,question]);
    const [data] = results;
    return data;
}




export  { updateUserPassword, getUserIdAfterAuth }