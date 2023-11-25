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
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const getChat_1 = require("./handlers/getChat");
const createChat_1 = require("./handlers/createChat");
const getAllChats_1 = require("./handlers/getAllChats");
const getChatsById_1 = require("./handlers/getChatsById");
const chatRouter = express_1.default.Router();
exports.chatRouter = chatRouter;
chatRouter.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, getAllChats_1.getAllChatsApi)();
            if (!result)
                throw new Error("No Chats Found");
            res.json(result);
        }
        catch (error) {
            console.log(error);
        }
    });
});
chatRouter.get("/cid", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fid = req.query.fid;
            // const sid = req.query.sid
            const result = yield (0, getChatsById_1.getChatsById)(Number(fid)); //,Number(sid) as number
            if (!result)
                throw new Error("No Chats Found");
            res.json(result);
        }
        catch (error) {
            console.log(error);
        }
    });
});
chatRouter.get("/cidSecond", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sid = req.query.sid;
            const result = yield (0, getChatsById_1.getChatsBySecondId)(Number(sid)); //,Number(sid) as number
            if (!result)
                throw new Error("No Chats Found");
            res.json(result);
        }
        catch (error) {
            console.log(error);
        }
    });
});
chatRouter.get("/single", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chatId = +req.query.chatId;
            if (typeof chatId !== "number")
                throw new Error("Invalid Chat Id");
            const result = yield (0, getChat_1.getChatApi)(chatId);
            res.json(result);
        }
        catch (error) {
            console.log(error);
        }
    });
});
chatRouter.post("/new", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstUserId, secondUserId, firstUserName, secondUserName } = req.body;
            const dataForPost = { firstUserId, secondUserId, firstUserName, secondUserName };
            if (!firstUserId || !secondUserId)
                throw new Error("Invalid user id");
            const data = yield (0, createChat_1.createNewChatApi)(dataForPost);
            res.json({ message: "chat has started", data });
        }
        catch (error) {
            console.log(error);
            return next(error);
        }
    });
});
