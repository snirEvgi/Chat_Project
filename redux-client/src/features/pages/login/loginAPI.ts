import axios from "axios"

const url = "http://localhost:4000"

export async function userLogin(email: string, password: string) {
  try {
    const result = await axios.post(`${url}/auth/login`, { email, password })
    return result.data
  } catch (error) {
    // console.error("Login failed:", error)
    // throw error
  }
}
