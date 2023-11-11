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
exports.getUserIdAfterAuth = exports.updateUserPassword = void 0;
const db_1 = require("../../../db");
const signup_1 = require("../signup");
function updateUserPassword(password, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield (0, signup_1.getHashedPassword)(password);
        const query = `
    UPDATE vacations.users 
    SET 
        password = ?,
        hashedPassword = ?,
        salt = ?
    WHERE
        (id = ?) 
    `;
        const result = yield db_1.pool.execute(query, [
            password,
            hashedPassword.password,
            hashedPassword.salt,
            id,
        ]);
        const [data] = result;
        console.log(data.insertId);
        return data.insertId;
    });
}
exports.updateUserPassword = updateUserPassword;
function getUserIdAfterAuth(question, email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!question || !email)
            return new Error("Missing data");
        const query = `
    SELECT 
    id
FROM
    vacations.users
WHERE
    question = ?
        AND email = ?;
      `;
        const results = yield db_1.pool.execute(query, [email, question]);
        const [data] = results;
        return data;
    });
}
exports.getUserIdAfterAuth = getUserIdAfterAuth;
