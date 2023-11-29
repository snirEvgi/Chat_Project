import React, { useEffect, useRef, useState } from "react"
import "./list.css"
import SingleChatComponent from "../../pages/singleChat"
import online from "../../images/online.png"
import offline from "../../images/offline.png"
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
  const [isSingleChatOn, setIsSingleChatOn] = useState<boolean>(false)
  const [isGroupChatOn, setIsGroupChatOn] = useState<boolean>(false)
  const [isGroupOn, setIsGroupOn] = useState<boolean>(false)
  const [chats, setChats] = useState<Array<any>>([])
  const [groupChats, setGroupChats] = useState<Array<any>>([])
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const token = localStorage.getItem("token")
  const [socket, setSocket] = useState<Socket>()
  const [isMessageNew, setIsMessageNew] = useState<boolean>(false)
  const [showGroupChatModal, setShowGroupChatModal] = useState<boolean>(false)
  const [isCreateChatCalled, setIsCreateChatCalled] = useState(false);
  const groupChatNameRef = useRef<HTMLInputElement>(null)

  const handleGroupChatIconClick = () => {
    setShowGroupChatModal(true)
  }

  const handleCreateGroupChat = () => {
    setShowGroupChatModal(true)
    const groupChatName = groupChatNameRef.current?.value
    setShowGroupChatModal(false)
  }

  const userName = `${userData?.firstName} ${userData?.lastName}`
  const onlineUsers =
    JSON.parse(localStorage.getItem("onlineUsers") as any) || []

    
    const usersData = props.users.filter((user: any) => {
      return user?.id !== userData?.id
    })
    const filteredUsersData = usersData.filter((user: any) => {
      return !chats.some((cUser: any) => cUser.firstUserId  === user?.id) && !chats.some((cUser: any) => cUser.secondUserId  === user?.id)
    })


  const isUserOnline = filteredUsersData.map((user: any) =>
    onlineUsers.some((onlineUser: any) => onlineUser?.id === user?.id),
  )

const onlineUsersInList = chats.map((c:any)=>{
  return onlineUsers.some((onlineUser: any) => onlineUser?.id === (userName === c?.firstUserName ? c?.secondUserId : c?.firstUserId))
})||[]

  
  const chatHandler = (chat: any) => {
    setSelectedChatId((prevChatId) =>
      prevChatId === chat.chatId ? null : chat.chatId,
    )
    if (selectedChatId !== null) {
      isSingleChatOn
    }
    setSelectedGroupChatId(null)
    setCurrentChat(chat)
  }

  const groupChatHandler = (groupChat: any) => {
    setSelectedGroupChatId((prevChatId) =>
      prevChatId === groupChat.group_chat_id ? null : groupChat.group_chat_id,
    )
    setSelectedChatId(null)

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
    if (!isCreateChatCalled) {
      const dataForChat = {
        firstUserId: userData?.id,
        secondUserId: user?.id,
        firstUserName: userName,
        secondUserName: user?.firstName + " " + user.lastName,
      };
  
      setIsCreateChatCalled(true);
try {
  
      await createNewChat(dataForChat as IChat)
      await fetchChats()
} catch (error) {
  console.log(error);
  
}finally{
  setIsCreateChatCalled(false);

}  }
  }
  return (
    <div className=" ml-[12rem] md:ml-[14rem] lg:ml-[18rem]  ">
      {selectedChatId !== null  &&(
        <SingleChatComponent
          chatOn={true}
          currentChat={currentChat}
          roomId={selectedChatId}
        />
      )}
      {selectedGroupChatId !== null &&  (
        <GroupChatComponent
          chatOn={true}
          currentChat={currentGroupChat}
          roomId={selectedGroupChatId}
        />
      )}
      <div className="flex flex-row h-screen min-w-1/6 bg-gray-900 absolute top-12 left-0">
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
                setIsGroupOn(false)
                setIsOn(false)
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
                        <span className="flex justify-between hover:bg-gray-600 border-teal-400 rounded-3xl font-bold  text-teal-400">
                          {` ${user.firstName} ${user.lastName}`}{" "}
                            {isUserOnline[index] ? (
                              <img
                                height={20}
                                width={20}
                                src={online}
                                alt="online"
                                className="text-end"
                              />
                            ) : (
                              <img
                                height={20}
                                width={20}
                                src={offline}
                                alt="offline"
                                className="text-end scale-90"
                              />
                            )}
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
          {chats.map((chat: any,index:number) => (
            <li
              key={chat.chatId}
              onClick={() => chatHandler(chat)}
              className="cursor-pointer mb-2 p-2 flex justify-around  bg-gray-800 rounded-2xl"
            >
              <span className=" text-teal-400 ">
                {" "}
                {userData?.id === chat.firstUserId
                  ? chat.secondUserName
                  : chat.firstUserName}
              </span>
              {onlineUsersInList[index] ? (
                              <img
                                height={20}
                                width={20}
                                src={online}
                                alt="online"
                                className="text-end"
                              />
                            ) : (
                              <img
                                height={20}
                                width={20}
                                src={offline}
                                alt="offline"
                                className="text-end scale-90"
                              />
                            )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default List
