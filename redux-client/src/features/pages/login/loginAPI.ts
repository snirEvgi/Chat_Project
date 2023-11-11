import axios from "axios"

import { url } from "../sign-up/signUpAPI";

export async function userLogin(email: string, password: string) {
  try {
    const result = await axios.post(`${url}/auth/login`, { email, password })
    console.log(result);
    
    return result.data
  } catch (error) {
    // console.error("Login failed:", error)
    // throw error
  }
}
