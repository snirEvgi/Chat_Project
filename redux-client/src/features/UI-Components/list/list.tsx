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
} from "../../pages/homePage/mainAPI"
import { Socket, io } from "socket.io-client"

const List = (props: any) => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [isOn, setIsOn] = useState<boolean>(false)
  const [isChatOn, setIsChatOn] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<any>({})
  const [chats, setChats] = useState<Array<any>>([])
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const token = localStorage.getItem("token")
  const [socket, setSocket] = useState<Socket>()
  const userName = `${userData?.firstName} ${userData?.lastName}`
  const [onlineUsersFromServer, setOnlineUsersFromServer] = useState([])
  const onlineUsers = JSON.parse(localStorage.getItem("onlineUsers") as any)
  const [onlineUsersFromServerFlag, setOnlineUsersFromServerFlag] = useState<
    Array<boolean>
  >([])

  const usersData = props.users.filter((user: any) => {
    return user?.id !== userData?.id
  })
  const isUserOnline = usersData.map((user: any) =>
    onlineUsers.some((onlineUser: any) => onlineUser?.id === user?.id),
  )
  // isUserOnline DATA

  //
  const chatHandler = (chatId: number) => {
    setSelectedChatId((prevChatId) => (prevChatId === chatId ? null : chatId))
  }

  const fetchChats = async () => {
    const result = await fetchChatsById(userData?.id)
    setChats(result)
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
  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (data) => {
        // console.log(data, "dataFroMaAPPPPP");
        setOnlineUsersFromServer(data.onlineUsers)
      })
      setOnlineUsersFromServerFlag(isUserOnline)

      // console.log(onlineUsersFromServerFlag)
    }
  }, [socket])

  // console.log(dataForChat, "this dataaaaaaaa")
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
    <div className="list-container">
      <Panel className="listContainer" header="Chat List">
        <Button
          onClick={() => {
            setIsOn(!isOn)
          }}
        >
          New Chat
        </Button>
        {isOn && (
          <div className="addChatForm">
            <ScrollPanel style={{ height: "10rem" }}>
              <ul className="p-list p-list-bordered chatList">
                {usersData.map((user: any, index: number) => (
                  <div
                    key={user?.email}
                    onClick={() => createNewChatHandler(user)}
                  >
                    <li key={user.id} className="p-list-item chatItem">
                      <span className="chatName">
                        {` ${user.firstName} ${user.lastName}`}{" "}
                        {onlineUsersFromServerFlag[index]
                          ? "Online"
                          : "Offline"}
                      </span>
                    </li>
                  </div>
                ))}
              </ul>
            </ScrollPanel>
          </div>
        )}
        <ScrollPanel style={{ height: "20rem" }}>
          <ul className="p-list p-list-bordered chatList">
            {chats.map((chat: any) => (
              <li
                key={chat.chatId}
                className="p-list-item chatItem"
                onClick={() => chatHandler(chat.chatId)}
              >
                <span className="chatName">{`${chat.firstUserName} & ${chat.secondUserName}`}</span>
              </li>
            ))}
          </ul>
        </ScrollPanel>
      </Panel>
      {selectedChatId !== null && (
        <div className="rightSideContainer">
          <SingleChatComponent
            chatOn={true}
            roomId={selectedChatId}
          ></SingleChatComponent>
        </div>
      )}
    </div>
  )
}

export default List
