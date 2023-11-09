import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("ws://localhost:4300");

function App() {
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

  return (
    <>
      <div className="card">
        <button
          onClick={() => {
            socket.emit("client-login", userName);
          }}
        >
          Login
        </button>
        <input
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </div>

      <div className="card">
        <button
          onClick={() => {
            socket.emit("client-send-message", message);
          }}
        >
          Start Chat
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </div>

      <div>
        {chatRows.map((row, index) => {
          const isCurrentUser = row.user === userName;
          console.log(row);

          return (
            <h3 key={index} style={{ color: isCurrentUser ? "green" : "red" }}>
              {`${row.user}: ${row.message}`}
            </h3>
          );
        })}
      </div>
    </>
  );
}

export default App;
