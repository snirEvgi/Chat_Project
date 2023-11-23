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
import { usersRouter } from "./users/route";

// initDB();
const ADMIN = "Admin";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/healthcheck", async (req, res) => {
  return res.send("API is working!!");
});

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/users", usersRouter);
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

// io.on("connection", (socket) => {
//   // console.log("New connection opened with the Server: ", socket.id);

//   socket.on("client-login", (userName) => {
//     // usersMapping[socket.id] = userName;
//     // socket.broadcast.emit("new-user-logged-in", `${userName} has joined`);
//     // Send a connection message to the specific user
//     // socket.emit("message-from-server", {
//     //   user: "Server",
//     //   message: `You (${userName}) are now connected`,
//     // });
//     // Notify other users about the new user joining
//     // socket.broadcast.emit("new-user-logged-in", `${userName} has joined`);
//   });

//   // Listen to messages sent by the client
//   // socket.on("client-send-message", (message) => {
//   //   const user = usersMapping[socket.id] || socket.id;
//   //   const formattedMessage = { user, message };
//   //   console.log(message);

//   //   // Sending the formatted message to ALL clients
//   //   io.emit("message-from-server", formattedMessage);
//   // });

//   socket.on("add-new-user", (user) => {
//     !onlineUsers.some((use) => use?.userId === user?.id) &&
//       onlineUsers.push({
//         userId:user?.id,
//         socketId: socket?.id,
//         userEmail:user?.email
//       });
//     console.log(onlineUsers, "onlineUsers");
//     io.emit("getOnlineUsers", onlineUsers);
//   });

//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log(`User ${socket.id} joined room ${roomId}`);
//   });

//   socket.on("message", (data) => {
//     const sender = onlineUsers.find((user) => user.socketId === socket.id);
//     if (sender) {
//       const messageData = {
//         roomId: data.roomId,
//         message: data.message,
//         senderId: sender.userId,
//         userEmail:sender?.userEmail,
//         time: new Intl.DateTimeFormat('default', {
//           hour: 'numeric',
//           minute: 'numeric',
//           second: 'numeric'
//       }).format(new Date())
//       };
//       console.log(
//         `Received message: ${data.message} from user ${sender.userId}`
//       );
//       io.to(data.roomId).emit("message", messageData);

//       // Save the message to the database here using your database logic
//       // Example: await saveMessageToDatabase(messageData);
//     }
//   });

//   socket.on("sendMessage", (message) => {
//     const user = onlineUsers.find((user) => user.userId === message.receiverId);

//     const messageData = {
//       text: message?.newMessage,
//       senderId: message?.email,
//     };
//     if (user) {
//       io.to(user.socketId).emit("getMessage", messageData);
//     }
//   });

//   socket.on("disconnect", () => {
//     onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
//     io.emit("getOnlineUsers", onlineUsers);
//     console.log("User disconnected:", socket.id);
//   });
// });

// state

const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Upon connection - only to user
  // socket.emit("message", buildMsg(ADMIN, "Welcome to Chat App!"));

  socket.on("enterRoom", ({ name, room }) => {
    // leave previous room
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      // io.to(prevRoom).emit(
        // "message",
        // buildMsg(ADMIN, `${name} has left the room`)
      // );
    }

    const user = activateUser(socket.id, name, room);

    // Cannot update previous room users list until after the state update in activate user
    if (prevRoom) {
      io.to(prevRoom).emit("userList", {
        users: getUsersInRoom(prevRoom),
      });
    }

    // join room
    socket.join(user.room);

    // To user who joined
    // socket.emit(
    //   "message",
      // buildMsg(ADMIN, `You have joined the ${user.room} chat room`)
    // );

    // To everyone else
    // socket.broadcast
    //   .to(user.room)
      // .emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));

    // Update user list for room
    io.to(user.room).emit("userList", {
      users: getUsersInRoom(user.room),
    });
    if (onlineUsers) {
      io.emit("getOnlineUsers", {
        onlineUsers: onlineUsers,
      });
    }
    // Update rooms list for everyone
    io.emit("roomList", {
      rooms: getAllActiveRooms(),
    });

  });

  socket.on("user-logged-in", (userData) => {
    const user = onlineUsers.find((user) => user.id === userData?.id);
    if (user) return;
    onlineUsers.push(userData);
    
    io.emit("getOnlineUsers", {
      onlineUsers: onlineUsers,
    });
  });

  socket.on("user-logged-out", (userData) => {
    const afterLogOutUsers = onlineUsers.filter(
      (user) => user.id !== userData?.id
    );
    onlineUsers = afterLogOutUsers;
    io.emit("getOnlineUsers", {
      onlineUsers: onlineUsers,
    });
    
  });

  // When user disconnects - to all others
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);

    if (user) {
      // io.to(user.room).emit(
      //   "message",
        // buildMsg(ADMIN, `${user.name} has left the room`)
      // );

      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });

      io.emit("roomList", {
        rooms: getAllActiveRooms(),
      });
    }

    console.log(`User ${socket.id} disconnected`);
  });

  // Listening for a message event
  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });

  // Listen for activity
  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;

    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });
});

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
}

// User functions
function activateUser(id, name, room) {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
}

function getUser(id) {
  return UsersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return UsersState.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map((user) => user.room)));
}
