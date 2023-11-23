import React, { useEffect, useState } from "react"
import { Panel } from "primereact/panel"
import { ScrollPanel } from "primereact/scrollpanel"
import "./list.css"
import SingleChatComponent from "../../pages/singleChat"
import { Button } from "primereact/button"
import {
  IChat,
  createNewChatApi,
  fetchChatsById,
  fetchChatsBySecondId,
} from "../../pages/homePage/mainAPI"
import { Socket, io } from "socket.io-client"

const List = (props: any) => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [isOn, setIsOn] = useState<boolean>(false)
  const [chats, setChats] = useState<Array<any>>([])
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const token = localStorage.getItem("token")
  const [socket, setSocket] = useState<Socket>()
  const userName = `${userData?.firstName} ${userData?.lastName}`
  const onlineUsers =
    JSON.parse(localStorage.getItem("onlineUsers") as any) || []

  const usersData = props.users.filter((user: any) => {
    return user?.id !== userData?.id
  })

  const filteredUsersData = usersData.filter((user: any) => {
    return !chats.some((cUser: any) => cUser?.secondUserId === user?.id)
  })

  const isUserOnline = usersData.map((user: any) =>
    onlineUsers.some((onlineUser: any) => onlineUser?.id === user?.id),
  )

  const chatHandler = (chatId: number) => {
    setSelectedChatId((prevChatId) => (prevChatId === chatId ? null : chatId))
  }

  const fetchChats = async () => {
    const result = await fetchChatsById(userData?.id)
    const result2 = await fetchChatsBySecondId(userData?.id)
    const result3 = [...result, ...result2]

    setChats(result3)
  }

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:4300")
      setSocket(newSocket)

      newSocket.on("connect", () => {
        newSocket.emit("user-logged-in", userData)
      })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [token, token !== undefined])

  const createNewChat = async (chat: IChat) => {
    try {
      if (!chat) return
      const result = await createNewChatApi(chat)
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }

  const createNewChatHandler = async (user: any) => {
    const dataForChat = {
      firstUserId: userData?.id,
      secondUserId: user?.id,
      firstUserName: userName,
      secondUserName: user?.firstName + " " + user.lastName,
    }
    await createNewChat(dataForChat as IChat)
    await fetchChats()
  }

  return (
    <div className="">
      {selectedChatId !== null && (
        <SingleChatComponent chatOn={true} roomId={selectedChatId} />
      )}
      <div className="flex flex-row h-screen w-1/6 bg-gray-900 absolute top-12 left-0">
        <ul className="list-none mt-4 w-full overflow-y-auto p-2">

          <li   className=" mb-2 p-3  bg-gray-800 rounded-2xl ">

         <span onClick={() => {
            setIsOn(!isOn)
          }} className="cursor-pointer mx-2 border-[2px] hover:bg-gray-600 border-teal-400 rounded-3xl font-bold p-2 text-teal-400">  
          <i className="pi pi-plus"></i></span>
         <span onClick={() => {
            setIsOn(!isOn)
          }} className="cursor-pointer mx-2 border-[2px] hover:bg-gray-600 border-teal-400 rounded-3xl font-bold p-2 text-teal-400">  
          <i className="pi pi-users"></i></span>
        </li>
        <div > 

        {isOn && (
           <ul className="list-none mt-4 w-full overflow-y-auto p-2">
           {filteredUsersData.length > 0 ? (
             filteredUsersData.map((user: any, index: number) => (
               <div
                 key={user?.email}
                 className=""
                 onClick={() => createNewChatHandler(user)}
               >
                 <li key={user.id} className="cursor-pointer mb-2 p-3  bg-gray-800 rounded-2xl">
                   <span className=" hover:bg-gray-600 border-teal-400 rounded-3xl font-bold  text-teal-400">
                     {` ${user.firstName} ${user.lastName}`}{" "}
                     {isUserOnline[index] ? "Online" : "Offline"}
                   </span>
                 </li>
               </div>
             ))
           ) : (
             <li>
               <span>No available users</span>
             </li>
           )}
         </ul>
        )}

        </div>
          {chats.map((chat: any) => (
            <li
              key={chat.chatId}
              onClick={() => chatHandler(chat.chatId)}
              className="cursor-pointer mb-2 p-2  bg-gray-800 rounded-2xl"
            >
              <span className=" text-teal-400 ">
                {" "}
                {userData?.id === chat.firstUserId
                  ? chat.secondUserName
                  : chat.firstUserName}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default List
