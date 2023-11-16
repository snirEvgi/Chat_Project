// The chats fetches component
import axios from "axios"
import { url } from "../../pages/sign-up/signUpAPI";


 async function fetchAllChats(): Promise<any> {
  try {
    const result = await axios.get(`${url}/chat`,)
    return result.data
  } catch (error) {
    
  }
}

 async function fetchSingleChat(chatId: string): Promise<any> {
  try {
    const result = await axios.get(`${url}/chat?chatId=${chatId}`,)
    return result.data
  } catch (error) {
  
  }
}
 async function fetchAllMessages(): Promise<any> {
  try {
    const result = await axios.get(`${url}/messages`,)
    return result.data
  } catch (error) {
    
  }
}


export  {fetchAllChats,fetchSingleChat,fetchAllMessages }