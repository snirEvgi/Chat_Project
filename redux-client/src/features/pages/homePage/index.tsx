import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./HomePage.css"
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
  fetchSingleChat,
  getAllUsersApi,
} from "./mainAPI"

const HomePage = () => {
  const navigate = useNavigate()
  const [isChatOn, setIsChatOn] = useState<boolean>(false)
  const [chats, setChats] = useState<Array<any>>([])
  const [users, setUsers] = useState<Array<any>>([])
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)

  useEffect(() => {
    const fetchChatsData = async () => {
      try {
        const result = await fetchAllChats()
        setChats(result)
        // console.log(chats)
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }
    fetchChatsData()
    getAllUsers()
  }, [isChatOn])
  useEffect(() => {
    document.title = `Home`
  }, [])
  useEffect(() => {}, [])

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
    <div className="homePageDiv">
      <div className="chatHeader">
        <Header title="This is header" />
      </div>

      <div className="flexedContent">
        <div className="leftSideList">
          <List chats={chats} onClick={handleChatClick} users={users} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
