import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { Socket, io } from "socket.io-client"
import "./SingleChatComponent.css"

function SingleChatComponent(props: any) {
  const dispatch = useAppDispatch()
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const userName = userData?.firstName + " " + userData?.lastName
  const [message, setMessage] = useState("")
  const [ chatRows, setChatRows] = useState<any[]>([])
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const newSocket = io("http://localhost:4300")

    // Join the chat room
    newSocket.emit("joinRoom", props.roomId)

    // Listen for incoming messages
    newSocket.on("message", (data) => {
      console.log(data)

      setChatRows((prevMessages) => [...prevMessages, data.message])
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [props.roomId])

  const handleSendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.emit("message", { roomId: props.roomId, message: message })
      setMessage("")
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
                  row.user === socket?.id ? "sentMessage" : "receivedMessage"
                }`}
              >
                <span 
                 className="messageUser">
                  {userData?.firstName !== undefined ? userName : "Unknown"}:
                </span>
                {" "}
                {row}
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
