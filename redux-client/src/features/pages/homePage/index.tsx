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

import { fetchAllChats, fetchSingleChat } from "./mainAPI"
// const { id, role, first_name, last_name } = userData
// const userRole = role
const HomePage = () => {
  const navigate = useNavigate()
  const [isChatOn, setIsChatOn] = useState<boolean>(false)
  const [chats, setChats] = useState<Array<any>>([])
  const [chatId, setChatId] = useState<Array<any>>([])

  useEffect(() => {
    const fetchChatsData = async () => {
      try {
        const result = await fetchAllChats()
        setChats(result)
        console.log(chats)
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }
    fetchChatsData()
  }, [])
  useEffect(() => {
    document.title = `Home`
  }, [])

  const handleChatClick = () => {
    //chatId:string
    setIsChatOn(!isChatOn)

    // Example: navigate(`/chat/${chatId}`);
  }

  return (
    <div className="homePageDiv">
      <div className="chatHeader">
        <Header title="This is header" />
      </div>

      <div className="flexedContent">
        <div className="leftSideList">
          <List chats={chats} onClick={handleChatClick} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
