import { signupSchema } from "../../route";
import bcrypt from "bcrypt";
import { pool } from "../../../db";
import { ResultSetHeader } from "mysql2";

interface IPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: any;
}
const saltRounds = 10;
export default async function signUp(signUpPayload: IPayload): Promise<number> {
  const { email, firstName, lastName, password, role } = signUpPayload;
  const hashedPassword = await getHashedPassword(password);
  const query = `
    
    INSERT INTO chat.users 
    (firstName, lastName, email, password , salt, role) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const result = await pool.execute(query, [
    firstName,
    lastName,
    email,
    hashedPassword.password,
    hashedPassword.salt,
    role || "user",
  ]);
  const [data] = result;
  console.log((data as ResultSetHeader).insertId);

  return (data as ResultSetHeader).insertId;
}

export async function getHashedPassword(
  password: string,
  salt?: string
): Promise<{ password: string; salt?: string }> {
  const s = salt || bcrypt.genSaltSync(saltRounds);
  const hashed = await bcrypt.hash(password, s);
  return { password: hashed, salt: s };
}
