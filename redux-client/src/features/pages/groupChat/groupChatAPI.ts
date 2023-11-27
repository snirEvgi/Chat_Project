import axios from "axios"
import { url } from "../sign-up/signUpAPI"

export async function postNewGroupMessage(message: any) {
  try {
    const result = await axios.post(`${url}/messages/newGroupMessage`, message)
    return result.data
  } catch (error) {
    console.log(error)
  }
}

export async function getGroupMessages(groupChatId: number) {
  try {
    const result = await axios.get(`${url}/messages/groupMessage?groupChatId=${groupChatId}`)
    return result.data
  } catch (error) {
    console.log(error)
  }
}
