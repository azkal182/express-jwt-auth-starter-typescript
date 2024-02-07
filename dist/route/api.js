"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = __importDefault(require("../controller/user-controller"));
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.use(auth_middleware_1.authMiddleware);
// User API
userRouter.get("/api/users/current", user_controller_1.default.getMeHandler);
userRouter.get("/api/users", user_controller_1.default.getAllUser);
