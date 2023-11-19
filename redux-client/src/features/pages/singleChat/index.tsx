import React, { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { Socket, io } from "socket.io-client"
import "./SingleChatComponent.css"
import { sendMessage } from "./singleChatSlice"
import { getMessages, getUser } from "./singleChatAPI"

function SingleChatComponent(props: any) {
  const dispatch = useAppDispatch()
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
  const userName = userData?.firstName + " " + userData?.lastName
  const [message, setMessage] = useState("")
  const [newMessage, setNewMessage] = useState({})
  const sender = userData?.email
  const [chatRows, setChatRows] = useState<any[]>([])
  const [socket, setSocket] = useState<Socket>()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [receiverData, setReceiverData] = useState([])
  const [receiver, setReceiver] = useState<any>({})
  const messagesRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }
  const receiverId = (
    onlineUsers.find((data: any) => data.userId !== userData.id) as any
  )?.userId

  // console.log(receiverId)
  // console.log(onlineUsers)
  
  const fetchChatHistory = async () => {
    try {
      const history = await getMessages(props.roomId)
      // console.log(history, "this")
      setChatRows(history)
      scrollToBottom()
    } catch (error) {
      console.log(error)
    }
  }
  
  const fetchReceiverData = async () => {
    try {
      const rData= await getUser(receiverId)
    setReceiverData(rData)
    console.log(receiverData);
    
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    fetchChatHistory()
  }, [])
  useEffect(() => {
    if (receiverId) {
       fetchReceiverData()
      // console.log(receiverData,"RERERERERE");
      setReceiver(receiverData[0])
     
    }

  }, [receiverId])
  
  useEffect(() => {
    const newSocket = io("http://localhost:4300")
    
    // Join the chat room
    newSocket.emit("joinRoom", props.roomId)
    
    // Listen for incoming messages
    newSocket.on("message", (data) => {
      console.log(data, "messagedATA")
      
      // setSender(data.senderId) 
      const prepMessage = {
        text:data?.message,
        senderId:receiver?.email,
        roomId:props?.roomId
      }
      setNewMessage(data?.message)
      setMessage(data?.message)
      
      setChatRows((prevMessages) => {
        return [...prevMessages, prepMessage]
      })
      setMessage("")
    })
    
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [props.roomId])
  
  useEffect(() => {
    socket?.emit("add-new-user", userData?.id)
    socket?.on("getOnlineUsers", (res) => {
      setOnlineUsers(res)
      // console.log(res);
      
    })
    
    return () => {
      socket?.off("getOnlineUsers")
    }
  }, [socket])
  
  useEffect(() => {
    socket?.emit("sendMessage", { newMessage:message, senderId:sender })
  }, [newMessage])
  
  useEffect(() => {
    socket?.on("getMessage", (res) => {
      console.log(res, "the message")
      
      setChatRows((prevMessages) => {
        return [...prevMessages, res]
      })
    })
    
    
    return () => {
      socket?.off("getMessage")
    }
  }, [socket])

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
      } catch (error) {
        console.log(error)
      } finally {
        setMessage("")
      }
    }
  }

  return (
    <div className="chatBox">
      {props.chatOn ? (
        <>
          {" "}
          <div className="chatHistory" ref={messagesRef}>
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
              onKeyDown={(e) => {
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
