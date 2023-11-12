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
// initDB();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get("/healthcheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("API is working!!");
}));
// app.use("/login", router);
app.use("/auth", route_1.authRouter);
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
