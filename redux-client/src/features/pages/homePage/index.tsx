import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./HomePage.css"
import { Socket, io } from "socket.io-client"
import { classNames } from "primereact/utils"
import { userData } from "../../handlers/hashData"
import { Rating } from "primereact/rating"
import newUserGuideVideo from "../../../upload/newHere.mp4"
import { motion as m, useScroll } from "framer-motion"
import Header from "../../UI-Components/header"
// import SingleChatComponent from "../singleChat"
import List from "../../UI-Components/list/list"

import {
  createNewChatApi,
  fetchAllChats,
  fetchChatsById,
  fetchSingleChat,
  getAllUsersApi,
} from "./mainAPI"

const HomePage = (props: any) => {
  const navigate = useNavigate()
  const [isChatOn, setIsChatOn] = useState<boolean>(false)
  const [users, setUsers] = useState<Array<any>>([])
  const [chats, setChats] = useState<Array<any>>([])
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const userRecord = JSON.parse(localStorage.getItem("userRecord") as any)

  const fetchChatsData = async (fid: number) => {
    try {
      const result = await fetchChatsById(fid)
      if (!result) return
      setChats(result)
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }
  useEffect(() => {
    fetchChatsData(userRecord?.id)

    getAllUsers()
  }, [isChatOn])
  useEffect(() => {
    document.title = `Home`
  }, [])

  const getAllUsers = async () => {
    try {
      const result = await getAllUsersApi()
      setUsers(result)
      console.log(users)
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }

  const handleChatClick = (chatId: number) => {
    setSelectedChatId((prevChatId) => (prevChatId === chatId ? null : chatId))
    setIsChatOn(!isChatOn)
  }

  return (
    <div className=" overflow-y-hidden">
      <div className="">
        <div className="overflow-y-hidden">
          <List chats={chats} onClick={handleChatClick} users={users} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
