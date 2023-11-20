import React, { useState } from "react"
import { Panel } from "primereact/panel"
import { ScrollPanel } from "primereact/scrollpanel"
import "./list.css"
import SingleChatComponent from "../../pages/singleChat"
import { Button } from "primereact/button"
import { IChat, createNewChatApi } from "../../pages/homePage/mainAPI"

const List = (props: any) => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [isOn, setIsOn] = useState<boolean>(false)
  const [isChatOn, setIsChatOn] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<any>({})
  const [chats, setChats] = useState<Array<any>>(props.chats)

  const userData = JSON.parse(localStorage.getItem("userRecord") as any)

  const chatHandler = (chatId: number) => {
    console.log(chatId)
    setSelectedChatId((prevChatId) => (prevChatId === chatId ? null : chatId))
  }
  const dataForChat = {
    firstUserId: userData?.id,
    secondUserId: currentUser?.id,
    firstUserName: userData?.email,
    secondUserName: currentUser?.email,
  }
  console.log(dataForChat, "this dataaaaaaaa")
  const createNewChat = async (chat: IChat) => {
    try {
      const result = await createNewChatApi(chat)
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }
  return (
    <div className="list-container">
      <Panel className="listContainer" header="Chat List">
        <Button
          onClick={() => {
            setIsOn(!isOn)
          }}
        >
          New Chat
        </Button>
        {isOn && (
          <div className="addChatForm">
            <ScrollPanel style={{ height: "10rem" }}>
              <ul className="p-list p-list-bordered chatList">
                {props.users.map((user: any) => (
                  <div
                    key={user?.email}
                    onClick={() => {
                      setCurrentUser(user), createNewChat(dataForChat as IChat)
                    }}
                  >
                    <li key={user.id} className="p-list-item chatItem">
                      <span className="chatName">{` ${user.email}`}</span>
                    </li>
                  </div>
                ))}
              </ul>
            </ScrollPanel>
          </div>
        )}
        <ScrollPanel style={{ height: "20rem" }}>
          <ul
            onClick={props.onClick}
            className="p-list p-list-bordered chatList"
          >
            {props.chats.map((chat: any) => (
              <li key={chat.chatId} className="p-list-item chatItem">
                <span
                  onClick={() => {
                    chatHandler(chat.chatId)
                  }}
                  className="chatName"
                >{`${chat.firstUserName} & ${chat.secondUserName}`}</span>
              </li>
            ))}
          </ul>
        </ScrollPanel>
      </Panel>
      {selectedChatId !== null && (
        <div className="rightSideContainer">
          <SingleChatComponent
            chatOn={true}
            roomId={selectedChatId}
          ></SingleChatComponent>
        </div>
      )}
    </div>
  )
}

export default List
