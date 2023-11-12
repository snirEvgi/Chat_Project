import express, { Request, Response, NextFunction } from "express";
import { getChatApi } from "./handlers/getChat";
import { createNewChatApi } from "./handlers/createChat";
import { getAllChatsApi } from "./handlers/getAllChats";

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
      const { firstUserId, secondUserId } = req.body;
      if (!firstUserId || !secondUserId) throw new Error("Invalid user id");
      await createNewChatApi(firstUserId, secondUserId);
      res.json({ message: "chat has started" });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

export { chatRouter };
