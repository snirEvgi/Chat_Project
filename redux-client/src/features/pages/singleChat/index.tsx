import React, { useState, useEffect, useRef } from "react"
import { Socket, io } from "socket.io-client"
import "./SingleChatComponent.css"
import { sendMessage } from "./singleChatSlice"
import { getMessages } from "./singleChatAPI"
import { useAppDispatch } from "../../../app/hooks"
import online from "../../images/online.png"
import offline from "../../images/offline.png"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
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
  const [isMessageNewFlag, setIsMessageNewFlag] = useState<boolean>(false)
  const [isMessageNewArray, setIsMessageNewArray] = useState<Array<any>>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

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
  let newMessagesFromOtherUser: any =
    chatRows.filter((user: any) => {
      return user.name === userName
    }) || []

  const isUserOnlineInRoom =
    onlineUserInRoomData.find((user: any) => {
      return user?.name === userName
    }) || []

  const handlerActivity = () => {
    socket?.emit("activity", userName)
  }
  const fetchChatHistory = async () => {
    setLoadingMessages(true)
    scrollToBottom()
    try {
      const history = await getMessages(props.roomId)
      setOldChatRows(history)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMessages(false)
    }
  }
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native)
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

        setIsMessageNewArray((pervData) => [
          ...pervData,
          ...[data.name !== userName && data.name],
        ])
        // console.log(prepMessage, "prepMessage")
        setIsMessageNewFlag(true)
        console.log(isMessageNewArray, "isMessageNewArray")
        console.log(isMessageNew, "isMessageNew")

        setChatRows((prevMessages) => {
          return [...prevMessages, ...[prepMessage]]
        })
        if (!isMessageNew && !props.roomId) {
          newMessagesFromOtherUser = []
        }
        if (
          chatRows.length === 0 ||
          chatRows.length === -1 ||
          chatRows.length > 0
        ) {
          setIsMessageNew(false)
          return
        } else {
          setIsMessageNew(data.name !== userName ? data.isNew : false)
        }
        console.log(isMessageNewFlag, "setIsMessageNewFlag")

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
      newMessagesFromOtherUser = []
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
    <div className="flex flex-col max-h-[30rem] md:max-h-[35rem] lg:max-h-[40rem] min-h-[24rem] w-fit md:w-full  lg:w-2/3 mx-auto p-4 mt-6 bg-gray-900 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center bg-gray-900 px-4 py-2 rounded-t-2xl border-b border-gray-600">
        <h3 className="text-xl text-white font-semibold">
          {prepCurrentChatData.name}
          <span className="inline-block ml-2">
            {isFriendOnline.id ? (
              <img height={25} width={25} src={online} alt="online" />
            ) : (
              <img height={25} width={25} src={offline} alt="offline" />
            )}
          </span>
        </h3>

        <div onClick={props.exitChat}>
          {" "}
          <i className="pi pi-times"></i>{" "}
        </div>
      </div>
      <div className="p-2">
        {isTyping && (
          <div className="text-white text-sm text-center  ">
            {typingUser} is typing...
          </div>
        )}
      </div>
      {isMessageNew ? (
        <div className="p-2 text-green-400 text-center">
          {`You Have (${newMessagesFromOtherUser.length + 1}) New Messages`}
        </div>
      ) : (
        <></>
      )}

      <div
        ref={messagesRef}
        className="flex-grow overflow-y-auto p-2 space-y-2 bg-gray-00 bg-opacity-80 rounded-b-2xl"
      >
        {props.chatOn ? (
          <>
            {loadingMessages && <div>Loading messages...</div>}
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
                <p>{row.text}</p>
                <div className="text-right text-xs">{row?.time}</div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-white">Choose a chat...</div>
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
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            handlerActivity()
            if (e.key === "Enter") handleSendMessage()
          }}
        />
        <button
          className="bg-teal-600 text-white p-2 rounded-r-md"
          onClick={handleSendMessage}
        >
          Send
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

export default SingleChatComponent
