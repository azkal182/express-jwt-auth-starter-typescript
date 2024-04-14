"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const public_api_1 = require("../route/public-api");
const error_middleware_1 = require("../middleware/error-middleware");
const api_1 = require("../route/api");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.web = (0, express_1.default)();
exports.web.use(express_1.default.json());
exports.web.use((0, cookie_parser_1.default)());
moment_timezone_1.default.tz.setDefault("Asia/Jakarta");
exports.web.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
    credentials: true,
}));
exports.web.use(public_api_1.publicRouter);
exports.web.use(api_1.userRouter);
exports.web.use(error_middleware_1.errorMiddleware);
