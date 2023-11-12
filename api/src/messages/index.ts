import express, { Request, Response, NextFunction } from "express"
import getAllMessages from "./handlers/getAllMessages";
import postNewMessage from "./handlers/postNewMessage";



const vacationsRouter = express.Router();

vacationsRouter.get("/", getAllMessagesApi)
vacationsRouter.post("/newMessage", postNewMessageApi)

async function getAllMessagesApi(req: Request, res: Response, next: NextFunction) {
    const { chatId } = req.params
    try {
        const results = await getAllMessages(chatId)
        res.json(results)
    } catch (error) {
        console.log(error);

        return next(error)
    }
}
async function postNewMessageApi(req: Request, res: Response, next: NextFunction) {
    const {senderId,chatId,text } = req.body
    try {
        const results = await postNewMessage(req.body)
        res.json(results)
    } catch (error) {
        console.log(error);

        return next(error)
    }
}