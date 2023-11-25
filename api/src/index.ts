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

let onlineUsers = [];

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
  socket.on("message", ({ name, text ,isMessageNew}) => {
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
    isNew:true
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
