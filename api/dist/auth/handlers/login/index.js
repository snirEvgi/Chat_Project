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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.getUserByEmail = void 0;
const db_1 = require("../../../db");
const signup_1 = require("../signup");
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email)
            throw new Error("getUserByEmail() Fn missing Email");
        const query = `SELECT * FROM chat.users WHERE email = ?`;
        const [data] = yield db_1.pool.execute(query, [email]);
        if (Array.isArray(data) && data.length > 0) {
            return data[0];
        }
        else {
            return null;
        }
    });
}
exports.getUserByEmail = getUserByEmail;
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const userRecord = yield getUserByEmail(email);
        if (!userRecord)
            throw new Error("User not exist");
        const { salt: userRecordSalt, password: userRecordPassword } = userRecord;
        const hashedPassword = yield (0, signup_1.getHashedPassword)(password, userRecordSalt);
        const result = hashedPassword.password === userRecordPassword;
        return { result, userRecord };
    });
}
exports.login = login;
