// The chats fetches component
import axios from "axios"
import { url } from "../../pages/sign-up/signUpAPI";


 async function fetchAllChats(): Promise<any> {
  try {
    const result = await axios.get(`${url}/chat`,)
    console.log(result, "allChats");
    
    return result.data
  } catch (error) {
    
  }
}

 async function fetchSingleChat(chatId: string): Promise<any> {
  try {
    const result = await axios.get(`${url}/chat?chatId=${chatId}`,)
    console.log(result);
    
    return result.data
  } catch (error) {
  
  }
}
 async function fetchAllMessages(): Promise<any> {
  try {
    const result = await axios.get(`${url}/messages`,)
    console.log(result, "messages");
    
    return result.data
  } catch (error) {
    
  }
}

 async function postNewMessage(chatId: string): Promise<any> {
  try {
    const result = await axios.get(`${url}/newMessages?chatId=${chatId}`,)
    console.log(result);
    
    return result.data
  } catch (error) {
  
  }
}
export  {fetchAllChats,fetchSingleChat,fetchAllMessages,postNewMessage }