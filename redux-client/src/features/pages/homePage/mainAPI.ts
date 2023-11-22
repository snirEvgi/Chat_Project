// The chats fetches component
import axios from "axios"
import { url } from "../../pages/sign-up/signUpAPI"
export interface IChat {
  firstUserId: number
  secondUserId: number
  firstUserName: string
  secondUserName: string
}
async function fetchAllChats(): Promise<any> {
  try {
    const result = await axios.get(`${url}/chat`)
    return result.data
  } catch (error) {}
}
async function fetchChatsById(fid: number): Promise<any> {
  try {
    const result = await axios.get(`${url}/chat/cid?fid=${fid}`) //&sid=${sid}
    return result.data
  } catch (error) {}
}

async function fetchSingleChat(chatId: string): Promise<any> {
  try {
    const result = await axios.get(`${url}/chat?chatId=${chatId}`)
    return result.data
  } catch (error) {}
}
async function fetchAllMessages(): Promise<any> {
  try {
    const result = await axios.get(`${url}/messages`)
    return result.data
  } catch (error) {}
}
async function createNewChatApi(chat: IChat): Promise<any> {
  console.log(chat)

  try {
    const result = await axios.post(`${url}/chat/new`, chat)
    return result.data
  } catch (error) {}
}
async function getAllUsersApi(): Promise<any> {
  try {
    const result = await axios.get(`${url}/users/`)
    return result.data
  } catch (error) {}
}

export {
  fetchAllChats,
  fetchSingleChat,
  fetchAllMessages,
  createNewChatApi,
  getAllUsersApi,
  fetchChatsById,
}
