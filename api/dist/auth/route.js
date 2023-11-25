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
exports.authRouter = exports.signupSchema = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const signup_1 = __importDefault(require("./handlers/signup"));
const login_1 = require("./handlers/login");
const dotenv_1 = __importDefault(require("dotenv"));
const passwordReseet_1 = require("./handlers/passwordReseet");
// import { logger } from "../logger"
dotenv_1.default.config();
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
exports.signupSchema = zod_1.default.object({
    firstName: zod_1.default.string().max(100),
    lastName: zod_1.default.string().max(100),
    email: zod_1.default.string(),
    password: zod_1.default.string(),
});
const loginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
function middlewareLogin(req, res, next) {
    try {
        loginSchema.parse(req.body);
        return next();
    }
    catch (error) {
        // logger.error(error.message)
        console.log(error.message);
        return res.status(400).send("This Error");
    }
}
authRouter.post("/login", middlewareLogin, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const { result, userRecord } = yield (0, login_1.login)(email, password);
            if (!result)
                throw new Error();
            const expiresIn = "1h";
            const signedToken = jsonwebtoken_1.default.sign({
                userName: userRecord.email,
                id: userRecord.id,
                role: userRecord.role,
            }, process.env.SECRET, { expiresIn });
            res.json({ token: signedToken, user: userRecord, expiration: expiresIn });
        }
        catch (error) {
            //   logger.error(error.message);
            console.log(error.message);
            return res.status(401).send("User is unauthorized");
        }
    });
});
function middlewareSignIn(req, res, next) {
    try {
        exports.signupSchema.parse(req.body);
        return next();
    }
    catch (error) {
        // logger.error(error.message);
        console.log(error.message);
        return res.status(400).send("Error");
    }
}
authRouter.post("/sign-up", middlewareSignIn, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, signup_1.default)(req.body);
            // console.log("User added id", result)
            return res.json({ message: "user successfully added!" });
        }
        catch (error) {
            //   logger.error(error.message);
            console.log(error.message);
            return next(error);
        }
    });
});
authRouter.put("/passwordReset/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password } = req.body;
        const { id } = req.params;
        try {
            const result = yield (0, passwordReseet_1.updateUserPassword)(password, Number(id));
            return res.json({ message: "user password updated!" });
        }
        catch (error) {
            //   logger.error(error.message);
            console.log(error.message);
            return next(error);
        }
    });
});
authRouter.get("/salvageId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { question, email } = req.query;
        try {
            const result = yield (0, passwordReseet_1.getUserIdAfterAuth)(email, question);
            return res.json({ message: "userId achieved", result });
        }
        catch (error) {
            //   logger.error(error.message);
            console.log(error.message);
            return next(error);
        }
    });
});
