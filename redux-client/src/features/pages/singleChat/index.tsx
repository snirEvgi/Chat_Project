import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { Socket, io } from "socket.io-client"
import "./SingleChatComponent.css"
import { sendMessage } from "./singleChatSlice"
import { getMessages } from "./singleChatAPI"

function SingleChatComponent(props: any) {
  const dispatch = useAppDispatch()
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const userName = userData?.firstName + " " + userData?.lastName
  const [message, setMessage] = useState("")
  const sender = userData?.email
  const [chatRows, setChatRows] = useState<any[]>([])
  const [socket, setSocket] = useState<Socket>()
  const [flag, setFlag] = useState(false)

  const fetchChatHistory = async () => {
    const history = await getMessages(props.roomId)
    console.log(history, "this")
    setChatRows(history)
  }

  useEffect(() => {
    if (!flag) fetchChatHistory()
  }, [chatRows])

  useEffect(() => {
    setFlag(true)
    const newSocket = io("http://localhost:4300")

    // Join the chat room
    newSocket.emit("joinRoom", props.roomId)

    // Listen for incoming messages
    newSocket.on("message", (data) => {
      console.log(data)

      // setSender(data.senderId)
      setMessage(data.message)
      setChatRows((prevMessages) => {
        return [...prevMessages, data]
      })
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [props.roomId])

  const handleSendMessage = async () => {
    if (socket && message.trim() !== "") {
      socket.emit("message", {
        roomId: props.roomId,
        message: message,
        senderId: sender,
      })
      const messagePack = {
        senderId: sender,
        chatId: props.roomId,
        text: message,
      }
      try {
        const response = await dispatch(sendMessage(messagePack))
        fetchChatHistory()
        setFlag(true)
      } catch (error) {
        console.log(error)
      } finally {
        setMessage("")
        setFlag(true)
      }
    }
  }

  return (
    <div className="chatBox">
      {props.chatOn ? (
        <>
          {" "}
          <div className="chatHistory">
            {chatRows.map((row, index) => (
              <div
                key={index}
                className={`messageBubble ${
                  row.senderId === sender ? "sentMessage" : "receivedMessage"
                }`}
              >
                <span className="messageUser">
                  {row.senderId === sender
                    ? "You"
                    : userName
                    ? row.senderId
                    : "Unknown"}
                  :
                </span>{" "}
                {row.text}
              </div>
            ))}
          </div>
          <div className="inputBox">
            <input
              className="inputTextSend"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
