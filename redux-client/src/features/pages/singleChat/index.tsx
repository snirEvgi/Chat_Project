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
  const [onlineUsers, setOnlineUsers] = useState([])
  // console.log(onlineUsers, "single chat OU")
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const userName = `${userData?.firstName} ${userData?.lastName}`
  const sender = userData?.email
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState("")

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
      setOnlineUsers(data.users)
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
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
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
    <div className="chatBox">
      {props.chatOn ? (
        <>
          <div className="chatHistory" ref={messagesRef}>
            {chatRows.map((row, index) => (
              <div
                key={index}
                className={`messageBubble ${
                  row.name === sender ? "sentMessage" : "receivedMessage"
                }`}
              >
                <span className="messageUser">
                  {row.name === sender ? "You" : sender}:
                </span>{" "}
                {row.text}
                <br />
                <span style={{ position: "relative", left: "40.5rem" }}>
                  {row.time}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="typingIndicator">{typingUser} is typing...</div>
            )}
          </div>
          <div className="inputBox">
            <input
              className="inputTextSend"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                handlerActivity()
                e.code === "Enter" && handleSendMessage()
              }}
            />
            <button className="buttonSend" onClick={handleSendMessage}>
              {`>>`}
            </button>
          </div>
        </>
      ) : (
        <div className="chatHistory"> Choose a chat...</div>
      )}
    </div>
  )
}

export default SingleChatComponent
