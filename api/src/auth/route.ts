import express, { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import zod from "zod";
import signUp from "./handlers/signup";
import { login } from "./handlers/login";
import dotenv from "dotenv";
import {
  getUserIdAfterAuth,
  updateUserPassword,
} from "./handlers/passwordReseet";
// import { logger } from "../logger"
dotenv.config();

const authRouter = express.Router();

export const signupSchema = zod.object({
  firstName: zod.string().max(100),
  lastName: zod.string().max(100),
  email: zod.string(),
  password: zod.string(),
});

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

function middlewareLogin(req: Request, res: Response, next: NextFunction) {
  try {
    loginSchema.parse(req.body);
    return next();
  } catch (error) {
    // logger.error(error.message)
    console.log(error.message);

    return res.status(400).send("This Error");
  }
}

authRouter.post(
  "/login",
  middlewareLogin,
  async function (req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const { result, userRecord } = await login(email, password);
      console.log(userRecord,"lolololoolololololololol");
      
      if (!result) throw new Error();
      const expiresIn = "1h";
      const signedToken = jsonwebtoken.sign(
        {
          userName: userRecord.email,
          id: userRecord.id,
          role: userRecord.role,
        },
        process.env.SECRET,
        { expiresIn }
      );

      res.json({ token: signedToken, user: userRecord, expiration: expiresIn });
    } catch (error) {
      //   logger.error(error.message);
      console.log(error.message);
      return res.status(401).send("User is unauthorized");
    }
  }
);

function middlewareSignIn(req: Request, res: Response, next: NextFunction) {
  try {
    signupSchema.parse(req.body);
    return next();
  } catch (error) {
    // logger.error(error.message);
    console.log(error.message);
    return res.status(400).send("Error");
  }
}

authRouter.post(
  "/sign-up",
  middlewareSignIn,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await signUp(req.body);
      // console.log("User added id", result)
      return res.json({ message: "user successfully added!" });
    } catch (error) {
      //   logger.error(error.message);
      console.log(error.message);

      return next(error);
    }
  }
);
authRouter.put(
  "/passwordReset/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    const { id } = req.params;
    try {
      const result = await updateUserPassword(password, Number(id));
      return res.json({ message: "user password updated!" });
    } catch (error) {
      //   logger.error(error.message);
      console.log(error.message);
      return next(error);
    }
  }
);
authRouter.get(
  "/salvageId",
  async function (req: Request, res: Response, next: NextFunction) {
    const { question, email } = req.query;
    try {
      const result = await getUserIdAfterAuth(
        email as string,
        question as string
      );

      return res.json({ message: "userId achieved", result });
    } catch (error) {
      //   logger.error(error.message);
      console.log(error.message);
      return next(error);
    }
  }
);

export { authRouter };
