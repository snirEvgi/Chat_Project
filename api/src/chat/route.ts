import express, { Request, Response, NextFunction } from "express";
import { getChatApi } from "./handlers/getChat";
import { createNewChatApi } from "./handlers/createChat";
import { getAllChatsApi } from "./handlers/getAllChats";
import { getChatsById, getChatsBySecondId } from "./handlers/getChatsById";

const chatRouter = express.Router();


chatRouter.get(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getAllChatsApi();
      if (!result) throw new Error("No Chats Found");
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
);
chatRouter.get(
  "/cid",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const fid = req.query.fid
      // const sid = req.query.sid
      const result = await getChatsById(Number(fid) as number);//,Number(sid) as number
      if (!result) throw new Error("No Chats Found");
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
);
chatRouter.get(
  "/cidSecond",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const sid = req.query.sid
      const result = await getChatsBySecondId(Number(sid) as number);//,Number(sid) as number
      if (!result) throw new Error("No Chats Found");
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
);

chatRouter.get(
  "/single",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const chatId = +req.query.chatId;
      if (typeof chatId !== "number") throw new Error("Invalid Chat Id");
      const result = await getChatApi(chatId);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
);

chatRouter.post(
  "/new",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { firstUserId, secondUserId, firstUserName,
        secondUserName} = req.body;
        const dataForPost = {firstUserId, secondUserId,firstUserName,secondUserName}
      if (!firstUserId || !secondUserId) throw new Error("Invalid user id");

     const data = await createNewChatApi(dataForPost);
      res.json({ message: "chat has started", data});
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

export { chatRouter };
