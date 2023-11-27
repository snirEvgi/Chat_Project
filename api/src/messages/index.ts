import express, { Request, Response, NextFunction } from "express";
import getAllMessages from "./handlers/getAllMessages";
import postNewMessage from "./handlers/postNewMessage";
import getAllGroupMessages from "./handlers/getAllGroupMessages";
import postNewGroupMessage from "./handlers/postNewGroupMessage";

const messagesRouter = express.Router();

messagesRouter.get("/", getAllMessagesApi);
messagesRouter.get("/groupMessage", getAllGroupMessagesApi);
messagesRouter.post("/newMessage", postNewMessageApi);
messagesRouter.post("/newGroupMessage", postNewGroupMessageApi);

async function getAllMessagesApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const chatId = req.query.chatId;
  try {
    const results = await getAllMessages(chatId as string);
    res.json(results);
  } catch (error) {
    console.log(error);

    return next(error);
  }
}

async function getAllGroupMessagesApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const groupChatId = req.query.groupChatId;
  try {
    const results = await getAllGroupMessages(groupChatId as any);
    res.json(results);
  } catch (error) {
    console.log(error);

    return next(error);
  }
}

async function postNewMessageApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, room, text, time } = req.body;
  const messagePack = {
    name,
    room: Number(room),
    text,
    time: time as string,
  };
  try {
    const results = await postNewMessage(messagePack);
    res.json(results);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

async function postNewGroupMessageApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, group_chat_id, text, time } = req.body;
  const messagePack = {
    name,
    group_chat_id,
    text,
    time: time as string,
  };
  
  try {
    const results = await postNewGroupMessage(messagePack);
    res.json(results);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

export { messagesRouter };
