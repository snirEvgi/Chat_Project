import React, { useState, useEffect, useRef } from "react"
import { Socket, io } from "socket.io-client"
import "./groupChat.css"
import { sendMessage } from "../singleChat/singleChatSlice"
import { getMessages } from "../singleChat/singleChatAPI"
import { useAppDispatch } from "../../../app/hooks"
import { getGroupMessages, postNewGroupMessage } from "./groupChatAPI"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"

function GroupChatComponent(props: any) {
  const dispatch = useAppDispatch()

  const [message, setMessage] = useState("")
  const [onlineUserInRoomData, setOnlineUserInRoomData] = useState<Array<any>>(
    [],
  )
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
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
  const [isMessageNewArray, setIsMessageNewArray] = useState<Array<any>>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)

  const onlineUsersGlobal = JSON.parse(
    localStorage.getItem("onlineUsers") as any,
  )

  const currentChat = props.currentChat
  const usersData = onlineUsersGlobal.filter((user: any) => {
    return user?.id !== userData?.id
  })

  const prepCurrentChatData = {
    name: currentChat.chat_name,
  }
  //   const isFriendOnline: any =
  //     usersData.find((user: any) => {
  //       return user.id === prepCurrentChatData?.id
  //     }) || []

  const isUserOnlineInRoom =
    onlineUserInRoomData.find((user: any) => {
      return user?.name === userName
    }) || []
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native)
  }
  const handlerActivity = () => {
    socket?.emit("activity", userName)
  }
  const fetchChatHistory = async () => {
    setLoadingHistory(true)
    scrollToBottom()
    try {
      const history = await getGroupMessages(props.roomId)

      setOldChatRows(history)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingHistory(false)
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
        setIsMessageNew(data.name !== userName ? data.isNew : false)
        setIsMessageNewArray((pervData) => [
          ...pervData,
          ...[data.name !== userName && data.name],
        ])
        // console.log(prepMessage, "prepMessage")
        console.log(isMessageNewArray, "isMessageNewArray")
        console.log(isMessageNew, "isMessageNew")

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
      setSendingMessage(true)
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
          group_chat_id: Number(props.roomId),
          text: message,
          time: new Intl.DateTimeFormat("default", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date()) as string,
        }

        const response = await postNewGroupMessage(messagePack)
      } catch (error) {
        console.error("Error sending message:", error)
      } finally {
        setMessage("")
        setSendingMessage(false)
      }
    }
  }

  return (
    <div className="flex flex-col max-h-[30rem] md:max-h-[35rem] lg:max-h-[40rem] min-h-[24rem] w-fit md:w-full  lg:w-2/3 mx-auto p-4 mt-6 bg-gray-900 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center bg-gray-900 px-4 py-2 rounded-t-2xl border-b border-gray-600">
        <h3 className=" text-xl text-white font-semibold">
          {prepCurrentChatData.name}{" "}
        </h3>
        <div onClick={props.exitChat}>
          {" "}
          <i className="pi pi-times"></i>{" "}
        </div>
      </div>
      <div className="p-2">
        {loadingHistory && <div>Loading chat history...</div>}
        {isTyping && (
          <div className="text-white text-sm text-center  ">
            {typingUser} is typing...
          </div>
        )}
      </div>
      <div
        ref={messagesRef}
        className=" flex-grow overflow-y-auto p-2 space-y-2 bg-gray-00 bg-opacity-80 rounded-b-2xl"
      >
        {props.chatOn ? (
          <>
            <div className="">
              {oldChatRows.concat(chatRows).map((row, index) => (
                <div
                  key={index}
                  className={`break-words p-2 rounded-md m-2 text-white max-w-[80%] ${
                    row.name === userName
                      ? "bg-teal-600 ml-auto"
                      : "bg-[#1e293b] mr-auto"
                  }`}
                >
                  <div className="text-sm mb-1">
                    {row.name === userName ? "You" : row.name}
                  </div>
                  {row.text}
                  <div className=" text-right text-xs">{row.time}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-white"> Choose a chat...</div>
        )}
      </div>
      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute m-0 bottom-[1rem] right-[0rem] opacity-80 flex ">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center p-2  rounded-b-2xl">
        <input
          className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-none"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            handlerActivity()
            e.code === "Enter" && handleSendMessage()
          }}
        />
        <button
          className="bg-teal-600 text-white p-2 rounded-r-md"
          onClick={handleSendMessage}
        >
          {sendingMessage ? "Sending..." : ">>"}
        </button>
        <button
          className="bg-gray-700 text-white p-2 rounded-md ml-2"
          onClick={toggleEmojiPicker}
        >
          😀
        </button>
      </div>
    </div>
  )
}

export default GroupChatComponent
