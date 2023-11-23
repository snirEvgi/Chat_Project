import React, { useState, useEffect, useRef } from "react"
import { Socket, io } from "socket.io-client"
import "./SingleChatComponent.css"
import { sendMessage } from "./singleChatSlice"
import { getMessages } from "./singleChatAPI"
import { useAppDispatch } from "../../../app/hooks"

function SingleChatComponent(props: any) {
  const dispatch = useAppDispatch()

  const [message, setMessage] = useState("")
  const [chatRows, setChatRows] = useState<any[]>([])
  const [socket, setSocket] = useState<Socket>()
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const userName = `${userData?.firstName} ${userData?.lastName}`
  const sender = userData?.email
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState("")
  const onlineUsersGlobal = localStorage.getItem("onlineUsers")

  const handlerActivity = () => {
    socket?.emit("activity", userName)
    scrollToBottom()
  }
  const fetchChatHistory = async () => {
    try {
      const history = await getMessages(props.roomId)
      setChatRows(history)
    } catch (error) {
      console.log(error)
    } finally {
      scrollToBottom()
    }
  }

  useEffect(() => {
    const initSocket = () => {
      const newSocket = io("http://localhost:4300")

      newSocket.emit("enterRoom", { name: userName, room: props.roomId })

      newSocket.on("message", (data) => {
        const prepMessage = {
          name: data.name || userName,
          text: data.text,
          room: props.roomId,
          time: data.time,
        }

        setChatRows((prevMessages) => {
          return [...prevMessages, prepMessage]
        })
        scrollToBottom()
        setMessage("")
      })

      setSocket(newSocket)
    }
    socket?.on("roomList", (data) => {
      // Handle user list update if needed
      console.log(data, "roomlist")
    })
    initSocket()
    fetchChatHistory()
    return () => {
      socket?.off("message")
      socket?.disconnect()
    }
  }, [props.roomId])

  useEffect(() => {
    socket?.on("userList", (data) => {
      // Handle user list update if needed
      // setOnlineUsers(data.users)
      console.log(data, "online")
    })
    socket?.on("activity", (data) => {
      // Handle user list update if needed
      console.log(data)

      setTypingUser(data)
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        setTypingUser("")
      }, 3000)
    })

    // Cleanup function
    return () => {
      socket?.off("userList")
      socket?.disconnect()
    }
  }, [socket])

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop= messagesRef.current.scrollHeight
    }
  }

  const handleSendMessage = async () => {
    if (socket && message.trim() !== "") {
      try {
        socket.emit("message", {
          name: sender,
          text: message,
          room: props.roomId,
          time: new Intl.DateTimeFormat("default", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date()),
        })

        const messagePack = {
          name: sender,
          room: Number(props.roomId),
          text: message,
          time: new Intl.DateTimeFormat("default", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date()) as string,
        }

        const response = await dispatch(sendMessage(messagePack))

        // Log after successful send
        console.log("Message sent successfully")

        scrollToBottom()
      } catch (error) {
        // Log any errors
        console.error("Error sending message:", error)
      } finally {
        // Clear the message input
        setMessage("")
      }
    }
  }

  return (
    <div className="p-4  max-h-[700px] min-h-[700px]  relative ml-72">
        <div
          className=" fixed border-y 
           bg-gray-900 border-gray-900 flex justify-between items-center
            h-16 max-w-full w-[66.5%] rounded-2xl  px-3 text-white top-18 border"
        >
        <ul className="hidden md:flex">
          <li className="p-4">Call</li>
          <li className="p-4">Video</li>
          <li className="p-4">Pin to top</li>
        </ul>
      </div>
      <div className="  bg-gray-900 p-2 w-5/6 h-[600px] max-h-[600px] min-h-[600px] overflow-y-auto overflow-x-hidden rounded-2xl">
        {/* <br /> */}
        {props.chatOn ? (
          <>
            <div className="max-w-[480px]" ref={messagesRef}>
              {chatRows.map((row, index) => (
                <div
                  key={index}
                  className={` break-words p-2 rounded-xl m-2 ${
                    row.name === sender
                      ? "bg-teal-700"
                      : "bg-white text-black relative left-[600px]"
                  }`}
                >
                  <div className="text-center w-full border-b border-gray-900 p-0 m-0 mb-2 text-lg">
                    {row.name === sender ? "You" : sender}
                  </div>
                  <br />
                  <div className="p-1 mb-1">{row.text}</div>
                  <br />
                  <span className=" p-1 text-right text-xs">{row.time}</span>
                </div>
              ))}
              {isTyping && (
                <div className="typingIndicator">{typingUser} is typing...</div>
              )}
            </div>
          </>
        ) : (
          <div className="chatHistory"> Choose a chat...</div>
        )}
      </div>
      <div className="">
        <input
          className="text-black w-5/6 p-2 border border-gray-300 rounded"
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
