import axios from "axios"

export const url = "http://localhost:4100"

interface ISignUp {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function userSignUp(signUpPayload: ISignUp) {
  try {
    const result = await axios.post(`${url}/auth/sign-up`, {
      email: signUpPayload.email,
      password: signUpPayload.password,
      firstName: signUpPayload.firstName,
      lastName: signUpPayload.lastName,
    })
    return result.data
  } catch (error: any) {
    console.error("Sign-Up failed:", error)
    throw error
  }
}
