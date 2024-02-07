"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserValidation = exports.registerUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const registerUserValidation = joi_1.default.object({
    username: joi_1.default.string().max(100).required(),
    password: joi_1.default.string().max(100).required(),
    name: joi_1.default.string().max(100).required()
});
exports.registerUserValidation = registerUserValidation;
const loginUserValidation = joi_1.default.object({
    username: joi_1.default.string().max(100).required(),
    password: joi_1.default.string().max(100).required()
});
exports.loginUserValidation = loginUserValidation;
