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
exports.excludedFields = void 0;
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const jwt_1 = require("../utils/jwt");
const user_validation_1 = require("../validation/user-validation");
const validation_1 = require("../validation/validation");
const bcryptjs_1 = require("bcryptjs");
const lodash_1 = require("lodash");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const user_service_1 = __importDefault(require("./user-service"));
// Exclude this fields from the response
exports.excludedFields = ["password"];
const signToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Sign the access token
    const access_token = (0, jwt_1.signJwt)((0, lodash_1.omit)(user, exports.excludedFields), "accessTokenPrivateKey", {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
    });
    // Sign the refresh token
    const refresh_token = (0, jwt_1.signJwt)({ id: user.id }, "refreshTokenPrivateKey", {
        expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}m`,
    });
    // Create a Session
    connectRedis_1.default.set(String(user.id), JSON.stringify((0, lodash_1.omit)(user, exports.excludedFields)), {
        EX: 60 * 60,
    });
    // Return access token
    return { access_token, refresh_token };
});
const register = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (0, validation_1.validate)(user_validation_1.registerUserValidation, request);
    try {
        data.password = (0, bcryptjs_1.hashSync)(data.password, 10);
        const user = yield database_1.prismaClient.user.create({ data });
        return (0, lodash_1.omit)(user, ["password"]);
    }
    catch (err) {
        if (err.code === "P2002") {
            throw new response_error_1.ResponseError(409, "There is a unique constraint violation, a new user cannot be created with this username");
        }
    }
    // const countUser = await prismaClient.user.count({
    //     where: {
    //         username: user.username
    //     }
    // });
    // if (countUser === 1) {
    //     throw new ResponseError(400, "Username already exists");
    // }
    // user.password = await hash(user.password, 10);
    // return prismaClient.user.create({
    //     data: user,
    //     select: {
    //         username: true,
    //         name: true
    //     }
    // });
});
const login = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const loginRequest = (0, validation_1.validate)(user_validation_1.loginUserValidation, request);
    const user = yield database_1.prismaClient.user.findUnique({
        where: {
            username: loginRequest.username,
        },
    });
    if (!user) {
        throw new response_error_1.ResponseError(401, "Username or password wrong");
    }
    const isPasswordValid = (0, bcryptjs_1.compareSync)(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new response_error_1.ResponseError(401, "Username or password wrong");
    }
    // @ts-ignore
    const { access_token, refresh_token } = yield signToken(user);
    return { user: (0, lodash_1.omit)(user, ["password"]), access_token, refresh_token };
});
const refreshAccessTokenHandler = (refresh_token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the Refresh token
        const decoded = (0, jwt_1.verifyJwt)(refresh_token, "refreshTokenPublicKey");
        const message = "Could not refresh access token";
        if (!decoded) {
            return new response_error_1.ResponseError(403, message);
        }
        // Check if the user has a valid session
        const session = yield connectRedis_1.default.get(decoded.id);
        if (!session) {
            return new response_error_1.ResponseError(403, message);
        }
        // Check if the user exist
        const user = yield user_service_1.default.findUserById(JSON.parse(session).id);
        if (!user) {
            return new response_error_1.ResponseError(403, message);
        }
        const { access_token, refresh_token: new_refresh_token } = yield signToken(
        // @ts-ignore
        user);
        return { access_token, refresh_token: new_refresh_token };
    }
    catch (err) {
        return new response_error_1.ResponseError(403, "Could not refresh access token");
    }
});
exports.default = {
    register,
    login,
    refreshAccessTokenHandler,
};
