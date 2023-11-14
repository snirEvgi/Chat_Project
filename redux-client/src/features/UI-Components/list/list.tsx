import React, { SyntheticEvent } from "react"
import { Panel } from "primereact/panel"
import { ScrollPanel } from "primereact/scrollpanel"
import "./list.css"

const List = (props: any) => {
const handler = async ()=>{
    
}
  return (
    <Panel className="listContainer" header="Chat List">
      <ScrollPanel style={{ height: "20rem" }}>
        <ul onClick={props.onClick} className="p-list p-list-bordered chatList">
          {props.chats.map((chat: any) => (
            <li key={chat.chatId} className="p-list-item chatItem">
              <span className="chatName">{`${chat.firstUserId} & ${chat.secondUserId}`}</span>
            </li>
          ))}
        </ul>
      </ScrollPanel>
    </Panel>
  )
}

export default List
