import { pool } from "../../../database"
import { getHashedPassword } from "../signup"
export async function getUserByEmail(email: string): Promise<any> {
    if (!email) throw new Error("getUserByEmail() Fn missing Email")
    const query = `SELECT * FROM vacations.users WHERE email = ?`
    const [ data ] = await pool.execute(query, [email])
    // g( "this is data   ",data);
    if (Array.isArray(data) && data.length > 0) {
        return data[0];
    } else {
        return null;
    }
}

export async function login(email: string, password: string): Promise<{ result: boolean, userRecord: any }> {
    const userRecord = await getUserByEmail(email);
    console.log(userRecord);
    if (!userRecord) throw new Error("User not exist");
    
    const { salt: userRecordSalt, hashedPassword: userRecordPassword } = userRecord as any
    const hashedPassword = await getHashedPassword(password, userRecordSalt)
    const result = hashedPassword.password === userRecordPassword
    
    return { result, userRecord };
}
