import express, { Request, Response, NextFunction } from "express";
import getUserById from "./handlers/getUserByid";
import { getAllUsers } from "./handlers/getAllUsers";


const usersRouter = express.Router();

usersRouter.get("/", getUsersApi);
usersRouter.get("/userBy", getUserByIdApi);


async function getUserByIdApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId  = req.query.userId;
  try {
    const results = await getUserById(userId as string);
    res.json(results);
  } catch (error) {
    console.log(error);

    return next(error);
  }   
}
async function getUsersApi(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const results = await getAllUsers()
    res.json(results);
  } catch (error) {
    console.log(error);

    return next(error);
  }   
}

export { usersRouter };
