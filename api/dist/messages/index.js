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
exports.messagesRouter = void 0;
const express_1 = __importDefault(require("express"));
const getAllMessages_1 = __importDefault(require("./handlers/getAllMessages"));
const postNewMessage_1 = __importDefault(require("./handlers/postNewMessage"));
const messagesRouter = express_1.default.Router();
exports.messagesRouter = messagesRouter;
messagesRouter.get("/", getAllMessagesApi);
messagesRouter.post("/newMessage", postNewMessageApi);
function getAllMessagesApi(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = req.query.chatId;
        try {
            const results = yield (0, getAllMessages_1.default)(chatId);
            res.json(results);
        }
        catch (error) {
            console.log(error);
            return next(error);
        }
    });
}
function postNewMessageApi(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, room, text, time } = req.body;
        const messagePack = {
            name,
            room: Number(room),
            text,
            time: time
        };
        try {
            const results = yield (0, postNewMessage_1.default)(messagePack);
            res.json(results);
        }
        catch (error) {
            console.log(error);
            return next(error);
        }
    });
}
