import axios from "axios"
import { url } from "../sign-up/signUpAPI"
import { IMessage } from "./singleChatSlice"

export async function postNewMessage(message: IMessage) {
  try {
    const result = await axios.post(`${url}/messages/newMessage`, message)
    console.log(result)

    return result.data
  } catch (error) {
    console.log(error)
  }
}

export async function getMessages(chatId: number) {
  try {
    const result = await axios.get(`${url}/messages?chatId=${chatId}`)
    console.log(result)

    return result.data
  } catch (error) {
    console.log(error)
  }
}
