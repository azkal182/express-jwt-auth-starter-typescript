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
exports.authMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const jwt_1 = require("../utils/jwt");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const user_service_1 = __importDefault(require("../service/user-service"));
const lodash_1 = require("lodash");
const auth_service_1 = require("../service/auth-service");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   const token = req.get("Authorization");
    //   if (!token) {
    //     res
    //       .status(401)
    //       .json({
    //         errors: "Unauthorized",
    //       })
    //       .end();
    //   } else {
    //     const user = await prismaClient.user.findFirst({
    //       where: {
    //         token: token,
    //       },
    //     });
    //     if (!user) {
    //       res
    //         .status(401)
    //         .json({
    //           errors: "Unauthorized",
    //         })
    //         .end();
    //     } else {
    //       req.user = user;
    //       next();
    //     }
    //   }
    try {
        // Get the token
        let access_token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            access_token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }
        if (!access_token) {
            // throw new ResponseError(401, "You are not logged in")
            return next(new response_error_1.ResponseError(401, "You are not logged in"));
        }
        // Validate Access Token
        const decoded = (0, jwt_1.verifyJwt)(access_token, "accessTokenPublicKey");
        if (!decoded) {
            return next(new response_error_1.ResponseError(401, `Invalid token or user doesn't exist`));
        }
        // Check if user has a valid session
        const session = yield connectRedis_1.default.get(decoded.id);
        console.log({ session });
        if (!session) {
            return next(new response_error_1.ResponseError(401, `User session has expired`));
        }
        // console.log({ session, decoded });
        // Check if user still exist
        const user = yield user_service_1.default.findUserById(JSON.parse(session).id);
        if (!user) {
            return next(new response_error_1.ResponseError(401, `User with that token no longer exist`));
        }
        // This is really important (Helps us know if the user is logged in from other controllers)
        // You can do: (req.user or res.locals.user)
        res.locals.user = (0, lodash_1.omit)(user, auth_service_1.excludedFields);
        next();
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.authMiddleware = authMiddleware;
