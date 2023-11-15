import React, { useState } from "react"
import { Panel } from "primereact/panel"
import { ScrollPanel } from "primereact/scrollpanel"
import "./list.css"
import SingleChatComponent from "../../pages/singleChat"

const List = (props: any) => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)

  const chatHandler = (chatId: number) => {
    console.log(chatId)
    setSelectedChatId((prevChatId) => (prevChatId === chatId ? null : chatId))
  }

  return (
    <div className="list-container">
      <Panel className="listContainer" header="Chat List">
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
                >{`${chat.firstUserId} & ${chat.secondUserId}`}</span>
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
