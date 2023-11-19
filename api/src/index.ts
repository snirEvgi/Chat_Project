import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
// import { initDB } from "./db";
// import router from "./login/route";
import { Server } from "socket.io";
import { authRouter } from "./auth/route";
import { chatRouter } from "./chat/route";
import { messagesRouter } from "./messages";

// initDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/healthcheck", async (req, res) => {
  return res.send("API is working!!");
});

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/messages", messagesRouter);

app.use((error, req, res, next) => {
  return res.status(500).json({ message: "Something went wrong" });
});

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});

const io = new Server(4300, {
  cors: {
    origin: "*",
  },
});

const usersMapping = {};
let onlineUsers = [];

io.on("connection", (socket) => {
  // console.log("New connection opened with the Server: ", socket.id);

  socket.on("client-login", (userName) => {
    // usersMapping[socket.id] = userName;
    // socket.broadcast.emit("new-user-logged-in", `${userName} has joined`);
    // Send a connection message to the specific user
    // socket.emit("message-from-server", {
    //   user: "Server",
    //   message: `You (${userName}) are now connected`,
    // });
    // Notify other users about the new user joining
    // socket.broadcast.emit("new-user-logged-in", `${userName} has joined`);
  });

  // Listen to messages sent by the client
  // socket.on("client-send-message", (message) => {
  //   const user = usersMapping[socket.id] || socket.id;
  //   const formattedMessage = { user, message };
  //   console.log(message);

  //   // Sending the formatted message to ALL clients
  //   io.emit("message-from-server", formattedMessage);
  // });

  socket.on("add-new-user", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log(onlineUsers, "onlineUsers");
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("message", (data) => {
    const sender = onlineUsers.find((user) => user.socketId === socket.id);
    if (sender) {
      const messageData = {
        roomId: data.roomId,
        message: data.message,
        senderId: sender.userId, // Use userId instead of socket.id
      };
      console.log(
        `Received message: ${data.message} from user ${sender.userId}`
      );
      io.to(data.roomId).emit("message", messageData);

      // Save the message to the database here using your database logic
      // Example: await saveMessageToDatabase(messageData);
    }
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("User disconnected:", socket.id);
  });
});
