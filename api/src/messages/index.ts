import express, { Request, Response, NextFunction } from "express";
import getAllMessages from "./handlers/getAllMessages";
import postNewMessage from "./handlers/postNewMessage";

const messagesRouter = express.Router();

messagesRouter.get("/", getAllMessagesApi);
messagesRouter.post("/newMessage", postNewMessageApi);

async function getAllMessagesApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const chatId  = req.query.chatId;
  try {
    const results = await getAllMessages(chatId as string);
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
  const { name, room, text,time } = req.body;
  const messagePack = {
    name,
    room : Number(room),
    text,
    time:time as string
  };
  try {
    const results = await postNewMessage(messagePack);
    res.json(results);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}
export { messagesRouter };
