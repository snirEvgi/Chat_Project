import React, { useEffect, useRef, useState } from "react"
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
  fetchGroupChatsById,
} from "../../pages/homePage/mainAPI"
import { Socket, io } from "socket.io-client"
import GroupChatModal from "../groupChatModal"
import GroupChatComponent from "../../pages/groupChat"

const List = (props: any) => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [selectedGroupChatId, setSelectedGroupChatId] = useState<number | null>(
    null,
  )
  const [currentChat, setCurrentChat] = useState<Array<any>>([])
  const [currentGroupChat, setCurrentGroupChat] = useState<Array<any>>([])
  const [isOn, setIsOn] = useState<boolean>(false)
  const [isGroupOn, setIsGroupOn] = useState<boolean>(false)
  const [chats, setChats] = useState<Array<any>>([])
  const [groupChats, setGroupChats] = useState<Array<any>>([])
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const token = localStorage.getItem("token")
  const [socket, setSocket] = useState<Socket>()
  const [isMessageNew, setIsMessageNew] = useState<boolean>(false)
  const [showGroupChatModal, setShowGroupChatModal] = useState<boolean>(false)
  const groupChatNameRef = useRef<HTMLInputElement>(null)

  const handleGroupChatIconClick = () => {
    setShowGroupChatModal(true)
  }

  const handleCreateGroupChat = () => {
    setShowGroupChatModal(true)
    const groupChatName = groupChatNameRef.current?.value
    // Perform any validations or checks
    // ...

    // Close the modal
    setShowGroupChatModal(false)
  }

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
  // const prepCurrentChatData = {
  //   name:
  //     userData.id === currentChat.firstUserId
  //       ? currentChat.secondUserName
  //       : currentChat.firstUserName,
  //   id:
  //     userData.id === currentChat.firstUserId
  //       ? currentChat.secondUserId
  //       : currentChat.firstUserId,
  // }
  // const isFriendOnline: any =
  //   usersData.find((user: any) => {
  //     return user.id === prepCurrentChatData?.id
  //   }) || []

  const chatHandler = (chat: any) => {
    setSelectedChatId((prevChatId) =>
      prevChatId === chat.chatId ? null : chat.chatId,
    )
    setCurrentChat(chat)
  }

  const groupChatHandler = (groupChat: any) => {
    setSelectedGroupChatId((prevChatId) =>
      prevChatId === groupChat.group_chat_id ? null : groupChat.group_chat_id,
    )
    setCurrentGroupChat(groupChat)
  }

  const fetchChats = async () => {
    const result = await fetchChatsById(userData?.id)
    const result2 = await fetchChatsBySecondId(userData?.id)
    const result3 = [...result, ...result2]

    setChats(result3)
  }

  const fetchGroupChats = async () => {
    const result = await fetchGroupChatsById(userData?.id)
    setGroupChats(result)
  }

  useEffect(() => {
    fetchChats()
    fetchGroupChats()
  }, [])

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:4300")
      setSocket(newSocket)

      newSocket.on("connect", () => {
        newSocket.emit("user-logged-in", userData)
      })
      socket?.on("message", (data) => {
        setIsMessageNew(data.name !== userName && data.isNew)
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

  const handleGroupOnClose = () => {
    setShowGroupChatModal(false)
    setIsGroupOn(false)
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
        <SingleChatComponent
          chatOn={true}
          currentChat={currentChat}
          roomId={selectedChatId}
        />
      )}
      <div>
        {selectedGroupChatId !== null && (
          <GroupChatComponent
            chatOn={true}
            currentChat={currentGroupChat}
            roomId={selectedGroupChatId}
          />
        )}
      </div>
      <div className="flex flex-row h-screen w-1/6 bg-gray-900 absolute top-12 left-0">
        <ul className="list-none mt-4 w-full overflow-y-auto p-2">
          <li className=" mb-2 p-3  bg-gray-800 rounded-2xl ">
            <span
              onClick={() => {
                setIsOn(!isOn)
                setIsGroupOn(false)
              }}
              className="cursor-pointer mx-2 border-[2px] hover:bg-gray-600 border-teal-400 rounded-3xl font-bold p-2 text-teal-400"
            >
              <i className="pi pi-plus"></i>
            </span>
            <span
              onClick={() => {
                setIsGroupOn(!isGroupOn)
                setIsOn(false)
              }}
              className="cursor-pointer mx-2 border-[2px] hover:bg-gray-600 border-teal-400 rounded-3xl font-bold p-2 text-teal-400"
            >
              <i className="pi pi-users"></i>
            </span>
            <span
              onClick={() => {
                setShowGroupChatModal(true)
              }}
              className="cursor-pointer mx-2 border-[2px] hover:bg-gray-600 border-teal-400 rounded-3xl font-bold p-2 text-teal-400"
            >
              <i className="pi pi-user-plus"></i>
            </span>
          </li>
          <div>
            {isOn && (
              <ul className="list-none mt-4 w-full overflow-y-auto p-2">
                {filteredUsersData.length > 0 ? (
                  filteredUsersData.map((user: any, index: number) => (
                    <div
                      key={user?.email}
                      className=""
                      onClick={() => createNewChatHandler(user)}
                    >
                      <li
                        key={user.id}
                        className="cursor-pointer mb-2 p-3  bg-gray-800 rounded-2xl"
                      >
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

            <ul className="list-none mt-4 w-full overflow-y-auto p-2">
              <GroupChatModal
                visible={showGroupChatModal}
                onClose={handleGroupOnClose}
                onCreate={handleCreateGroupChat}
              />
              {isGroupOn && (
                <div>
                  {" "}
                  <div className="mt-4">Select Group :</div>
                  {groupChats.map((groupChat: any) => (
                    <li
                      key={groupChat.group_chat_id}
                      onClick={() => groupChatHandler(groupChat)}
                      className="cursor-pointer mb-2 p-2  bg-gray-800 rounded-2xl"
                    >
                      <span className=" text-teal-400 ">
                        {" "}
                        {groupChat.chat_name}
                      </span>
                    </li>
                  ))}
                </div>
              )}
            </ul>
          </div>
          {chats.map((chat: any) => (
            <li
              key={chat.chatId}
              onClick={() => chatHandler(chat)}
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
