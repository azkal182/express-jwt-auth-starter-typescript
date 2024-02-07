"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controller/auth-controller"));
const publicRouter = express_1.default.Router();
exports.publicRouter = publicRouter;
publicRouter.post("/api/auth/register", auth_controller_1.default.register);
publicRouter.post("/api/auth/login", auth_controller_1.default.login);
// refresh token
publicRouter.get("/api/auth/refresh", auth_controller_1.default.refreshAccessToken);
publicRouter.get("/", (req, res) => {
    res.send("oke");
});
