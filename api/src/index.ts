import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
// import { initDB } from "./db";
// import router from "./login/route";
import { Server } from "socket.io";
import { authRouter } from "./auth/route";

// initDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/healthcheck", async (req, res) => {
  return res.send("API is working!!");
});

// app.use("/login", router);
app.use("/auth", authRouter);

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

io.on("connection", (socket) => {
  console.log("New connection opened with the Server: ", socket.id);

  socket.on("client-login", (userName) => {
    
    usersMapping[socket.id] = userName;

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
  socket.on("client-send-message", (message) => {
    const user = usersMapping[socket.id] || socket.id;
    const formattedMessage = { user, message };
    console.log(message);

    // Sending the formatted message to ALL clients
    io.emit("message-from-server", formattedMessage);
  });
});
