"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = require("./application/web");
const logging_1 = require("./application/logging");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
web_1.web.listen(port, () => {
    logging_1.logger.info(`[server]: Server is running at http://localhost:${port}`);
});
