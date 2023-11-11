import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./SingleChatComponent.css";

const socket = io("ws://localhost:4300");

function SingleChatComponent() {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [chatRows, setChatRows] = useState<any[]>([]);

  useEffect(() => {
    socket.on("message-from-server", (message) => {
      setChatRows((prevChatRows) => [...prevChatRows, message]);
    });

    socket.on("new-user-logged-in", (message) => {
      setChatRows((prevChatRows) => [
        ...prevChatRows,
        { user: "Server", message },
      ]);
    });
  }, []);

  const handleLogin = () => {
    socket.emit("client-login", userName);
  };

  const handleSendMessage = () => {
    socket.emit("client-send-message", message);
  };

  return (
    <div className="chatBox">
      <div className="chatHistory">
        {chatRows.map((row, index) => (
          <h3
            key={index}
            style={{ color: row.user === userName ? "green" : "red" }}
          >
            {`${row.user}: ${row.message}`}
          </h3>
        ))}
      </div>

      <div className="inputBox">

        <input
        className="inputTextSend"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="buttonSend" onClick={handleSendMessage}> {`>>`}</button>
      </div>
    </div>
  );
}

export default SingleChatComponent;
