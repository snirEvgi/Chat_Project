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
exports.getHashedPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../../db");
const saltRounds = 10;
function signUp(signUpPayload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, firstName, lastName, password, role } = signUpPayload;
        const hashedPassword = yield getHashedPassword(password);
        const query = `
    
    INSERT INTO chat.users 
    (firstName, lastName, email, password , salt, role) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
        const result = yield db_1.pool.execute(query, [
            firstName,
            lastName,
            email,
            hashedPassword.password,
            hashedPassword.salt,
            role || "user",
        ]);
        const [data] = result;
        console.log(data.insertId);
        return data.insertId;
    });
}
exports.default = signUp;
function getHashedPassword(password, salt) {
    return __awaiter(this, void 0, void 0, function* () {
        const s = salt || bcrypt_1.default.genSaltSync(saltRounds);
        const hashed = yield bcrypt_1.default.hash(password, s);
        return { password: hashed, salt: s };
    });
}
exports.getHashedPassword = getHashedPassword;
