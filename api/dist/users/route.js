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
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const getUserByid_1 = __importDefault(require("./handlers/getUserByid"));
const getAllUsers_1 = require("./handlers/getAllUsers");
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
usersRouter.get("/", getUsersApi);
usersRouter.get("/userBy", getUserByIdApi);
function getUserByIdApi(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.query.userId;
        try {
            const results = yield (0, getUserByid_1.default)(userId);
            res.json(results);
        }
        catch (error) {
            console.log(error);
            return next(error);
        }
    });
}
function getUsersApi(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield (0, getAllUsers_1.getAllUsers)();
            res.json(results);
        }
        catch (error) {
            console.log(error);
            return next(error);
        }
    });
}
