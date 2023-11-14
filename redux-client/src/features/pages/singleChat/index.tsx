  import React, { useState, useEffect } from "react"
  import { useAppDispatch, useAppSelector } from "../../../app/hooks"
  import { Socket, io } from "socket.io-client"
  import "./SingleChatComponent.css"
import { sendMessage } from "./singleChatSlice"

  function SingleChatComponent(props: any) {
    const dispatch = useAppDispatch()
    const userData = JSON.parse(localStorage.getItem("userRecord") as any)
    const userName = userData?.firstName + " " + userData?.lastName
    const [message, setMessage] = useState("")
    const [sender, setSender] = useState("")
    const [chatRows, setChatRows] = useState<any[]>([])
    const [socket, setSocket] = useState<Socket>()

    useEffect(() => {
      const newSocket = io("http://localhost:4300")

      // Join the chat room
      newSocket.emit("joinRoom", props.roomId)

      // Listen for incoming messages
      newSocket.on("message", (data) => {
        console.log(data)
        setSender(data.senderId)
        setMessage(data.message)
        setChatRows((prevMessages) => [...prevMessages, data.message])
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
          chatId: 1, 
          text:message
        }
        // try {
          
        // const response = await dispatch(sendMessage(messagePack))
        // console.log(response);
        
        // } catch (error) {
        //   console.log(error);
          
        // }

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
                    sender === socket?.id ? "sentMessage" : "receivedMessage"
                  }`}
                >
                  <span className="messageUser">
                    {sender === socket?.id ? "You" : row.senderId || "Unknown"}:
                  </span>{" "}
                  {message}
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
