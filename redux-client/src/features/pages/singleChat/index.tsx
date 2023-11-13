import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { Socket, io } from "socket.io-client"
import "./SingleChatComponent.css"
// import { checkUserToken } from "../login/loginSlice"

function SingleChatComponent() {
  const dispatch = useAppDispatch()
  // const userData1 = useAppSelector((state) => state.login.user)?.user
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const userName = userData?.firstName + " " + userData?.lastName

  const [message, setMessage] = useState("")
  const [chatRows, setChatRows] = useState<any[]>([])
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const newSocket = io("ws://localhost:4300")
    setSocket(newSocket)
    return () => {
      newSocket.disconnect()
    }
  }, [userData?.id])

  // useEffect(() => {
  //   dispatch(checkUserToken())
  // }, [dispatch])

  useEffect(() => {
    if (!socket) return
    socket.on("message-from-server", (message) => {
      setChatRows((prevChatRows) => [...prevChatRows, message])
    })

    socket.emit("add-new-user", userData?.id)
    socket.on("new-user-logged-in", (message) => {
      setChatRows((prevChatRows) => [
        ...prevChatRows,
        { user: "Server", message },
      ])
    })
  }, [socket])

  const handleLogin = () => {
    if (!socket) return
    socket.emit("client-login", userName)
  }

  const handleSendMessage = () => {
    if (!socket) return
    socket.emit("client-send-message", message)
  }

  return (
    <div className="chatBox">
      <div className="chatHistory">
        {chatRows.map((row, index) => (
          <div
            key={index}
            className={`messageBubble ${
              row.user === socket?.id ? "sentMessage" : "receivedMessage"
            }`}
          >
            <span className="messageUser">
              {" "}
              {userData?.firstName !== undefined ? userName : "Unknown"}:
            </span>
            <br />
            {row.message}
            <></>
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
          {" "}
          {`>>`}
        </button>
      </div>
    </div>
  )
}

export default SingleChatComponent
