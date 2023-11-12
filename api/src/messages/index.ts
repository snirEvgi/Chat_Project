import express, { Request, Response, NextFunction } from "express";
import getAllMessages from "./handlers/getAllMessages";
import postNewMessage from "./handlers/postNewMessage";

const messagesRouter = express.Router();

messagesRouter.get("/:id", getAllMessagesApi);
messagesRouter.post("/newMessage", postNewMessageApi);

async function getAllMessagesApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { chatId } = req.params;
  try {
    const results = await getAllMessages(chatId);
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
  const { senderId, chatId, text } = req.body;
  const messagePack = {
    senderId,
    chatId,
    text,
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
