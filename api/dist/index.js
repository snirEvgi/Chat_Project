"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// import { initDB } from "./db";
// import router from "./login/route";
const socket_io_1 = require("socket.io");
const route_1 = require("./auth/route");
const route_2 = require("./chat/route");
const messages_1 = require("./messages");
const route_3 = require("./users/route");
// initDB();
const ADMIN = "Admin";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get("/healthcheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("API is working!!");
}));
app.use("/auth", route_1.authRouter);
app.use("/chat", route_2.chatRouter);
app.use("/users", route_3.usersRouter);
app.use("/messages", messages_1.messagesRouter);
app.use((error, req, res, next) => {
    return res.status(500).json({ message: "Something went wrong" });
});
const { PORT } = process.env;
const server = app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`);
});
const io = new socket_io_1.Server(4300, {
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
        var _a;
        // leave previous room
        const prevRoom = (_a = getUser(socket.id)) === null || _a === void 0 ? void 0 : _a.room;
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
        const user = onlineUsers.find((user) => user.id === (userData === null || userData === void 0 ? void 0 : userData.id));
        if (user)
            return;
        onlineUsers.push(userData);
        io.emit("getOnlineUsers", {
            onlineUsers: onlineUsers,
        });
    });
    socket.on("user-logged-out", (userData) => {
        const afterLogOutUsers = onlineUsers.filter((user) => user.id !== (userData === null || userData === void 0 ? void 0 : userData.id));
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
        var _a;
        const room = (_a = getUser(socket.id)) === null || _a === void 0 ? void 0 : _a.room;
        if (room) {
            io.to(room).emit("message", buildMsg(name, text));
        }
    });
    // Listen for activity
    socket.on("activity", (name) => {
        var _a;
        const room = (_a = getUser(socket.id)) === null || _a === void 0 ? void 0 : _a.room;
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
