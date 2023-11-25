import React, { useState, useEffect, useRef } from "react"
import { Socket, io } from "socket.io-client"
import "./SingleChatComponent.css"
import { sendMessage } from "./singleChatSlice"
import { getMessages } from "./singleChatAPI"
import { useAppDispatch } from "../../../app/hooks"
import online from "../../images/online.png"
import offline from "../../images/offline.png"

function SingleChatComponent(props: any) {
  const dispatch = useAppDispatch()

  const [message, setMessage] = useState("")
  const [onlineUserInRoomData, setOnlineUserInRoomData] = useState<Array<any>>(
    [],
  )

  const [chatRows, setChatRows] = useState<any[]>([])
  const [oldChatRows, setOldChatRows] = useState<any[]>([])
  const [chat, setChat] = useState<any>({})
  const [socket, setSocket] = useState<Socket>()
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const userName = `${userData?.firstName} ${userData?.lastName}`
  const sender = userData?.email
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [typingUser, setTypingUser] = useState("")
  const [isMessageNew, setIsMessageNew] = useState<boolean>(false)
  const [isMessageNewArray, setIsMessageNewArray] = useState<Array<boolean>>([])
  const onlineUsersGlobal = JSON.parse(
    localStorage.getItem("onlineUsers") as any,
  )
  const currentChat = props.currentChat
  const usersData = onlineUsersGlobal.filter((user: any) => {
    return user?.id !== userData?.id
  })
  const prepCurrentChatData = {
    name:
      userData.id === currentChat.firstUserId
        ? currentChat.secondUserName
        : currentChat.firstUserName,
    id:
      userData.id === currentChat.firstUserId
        ? currentChat.secondUserId
        : currentChat.firstUserId,
  }
  const isFriendOnline: any =
    usersData.find((user: any) => {
      return user.id === prepCurrentChatData?.id
    }) || []

    const isUserOnlineInRoom = onlineUserInRoomData.find((user:any)=>{return user?.name === userName})||[]

  const handlerActivity = () => {
    socket?.emit("activity", userName)
  }
  const fetchChatHistory = async () => {
    scrollToBottom()
    try {
      const history = await getMessages(props.roomId)
      setOldChatRows(history)
    } catch (error) {
      console.log(error)
    } finally {
    }
  }
  
  useEffect(() => {
    const initSocket = () => {
      const newSocket = io("http://localhost:4300")

      newSocket.emit("enterRoom", { name: userName, room: props.roomId })

      newSocket.on("message", (data) => {
        const prepMessage = {
          name: data?.name,
          text: data?.text,
          room: props?.roomId,
          time: data?.time,
          isNew: data?.isNew,
        }
        setIsMessageNew(data.name !== userName && data.isNew)
        setIsMessageNewArray((p) => [...p, data.isNew])
        console.log(prepMessage, "prepMessage")

        setChatRows((prevMessages) => {
          return [...prevMessages, ...[prepMessage]]
        })
        scrollToBottom()
        setMessage("")
      })

      setSocket(newSocket)
    }
    // socket?.on("roomList", (data) => {

    // })
    initSocket()
    fetchChatHistory()
    return () => {
      socket?.off("message")
      socket?.disconnect()
      setIsMessageNewArray([])
      setIsMessageNew(false)
    }
  }, [props.roomId])
  useEffect(() => {
    socket?.on("userList", (data) => {
      console.log(data, "online")
      setOnlineUserInRoomData(data.users)
    })

    socket?.on("activity", (data) => {
      console.log(data)

      setTypingUser(data)
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        setTypingUser("")
      }, 3000)
    })

    return () => {
      socket?.off("userList")
      socket?.disconnect()
    }
  }, [socket])

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [chatRows])

  const handleSendMessage = async () => {
    if (socket && message.trim() !== "") {
      try {
        socket.emit("message", {
          name: userName,
          text: message,
          room: props.roomId,
          time: new Intl.DateTimeFormat("default", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date()),
        })

        const messagePack = {
          name: userName,
          room: Number(props.roomId),
          text: message,
          time: new Intl.DateTimeFormat("default", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date()) as string,
        }

        const response = await dispatch(sendMessage(messagePack))
      } catch (error) {
        console.error("Error sending message:", error)
      } finally {
        setMessage("")
      }
    }
  }

  return (
    <div className="p-4  mt-6 max-h-[700px] md:min-w-[200px] lg:min-w-[1080px] min-h-[700px] relative ml-72">
      <div
        className=" md:min-w-[200px] lg:min-w-[1080px] lg:fixed lg:border-y p-3
             bg-slate-700 border-gray-900 lg:flex justify-start items-center
            z-10  h-12 max-w-full rounded-2xl  px-3 text-white top-16 border gap-80"
      >
        <h3 className=" flex gap-2">
          {prepCurrentChatData.name}{" "}
          <span>
            {" "}
            {isFriendOnline.id ? (
              <img height={25} width={25} src={online} alt="online" />
            ) : (
              <img height={25} width={25} src={offline} alt="offline" />
            )}
          </span>
        </h3>
        {isTyping && (
          <div className="text-white text-base ">{typingUser} is typing...</div>
        )}
      </div>
      <div
        ref={messagesRef}
        className="  bg-gray-900 p-2 lg:w-[80%] h-[600px] max-h-[600px] min-h-[600px] md:min-w-[200px] lg:min-w-[600px] overflow-y-auto overflow-x-hidden rounded-2xl"
      >
        {props.chatOn ? (
          <>
            <div className="">
              {oldChatRows.map((row, index) => (
                <div
                  key={index}
                  className={` lg:max-w-[380px] break-words p-2 rounded-xl m-2 md:max-w-[200px] ${
                    row.name === userName
                      ? "bg-teal-700"
                      : "bg-white text-black relative left-[600px]"
                  }`}
                >
                  <div className="text-center w-full border-b border-gray-900 p-0 m-0 mb-2 text-lg">
                    {row.name === userName ? "You" : row.name}
                  </div>
                  <br />
                  <div className=" w-fit h-fit p-1 mb-1">{row.text}</div>
                  <br />
                  <span className=" p-1 text-right text-xs">{row.time}</span>
                </div>
              ))}
            </div>
           { isMessageNew && <div className="flex justify-around p-1 text-red-500">
              {" "}
              _____________________ New Messages _____________________
            </div>}
            {chatRows.map((row, index) => (
                <div
                  key={index}
                  className={` max-w-[480px] break-words p-2 rounded-xl m-2 ${
                    row.name === userName
                      ? "bg-teal-700"
                      : "bg-white text-black relative left-[600px]"
                  }`}
                >
                  <div className="text-center w-full border-b border-gray-900 p-0 m-0 mb-2 text-lg">
                    {row.name === userName ? "You" : row.name}
                  </div>
                  <br />
                  <div className=" w-fit h-fit p-1 mb-1">{row.text}</div>
                  <br />
                  <span className=" p-1 text-right text-xs">{row.time}</span>
                </div>
              ))}
          </>
        ) : (
          <div className="chatHistory"> Choose a chat...</div>
        )}
      </div>
      <div className="">
        <input
          className="text-black lg:w-[80%] p-2 border border-gray-300 rounded"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            handlerActivity()
            e.code === "Enter" && handleSendMessage()
          }}
        />
        <button
          className="text-black relative right-10 p-2 font-bold"
          onClick={handleSendMessage}
        >
          {`>>`}
        </button>
      </div>
    </div>
  )
}

export default SingleChatComponent
