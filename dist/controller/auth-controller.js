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
const auth_service_1 = __importDefault(require("../service/auth-service"));
const response_error_1 = require("../error/response-error");
// Cookie options
const accessTokenCookieOptions = {
    expires: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRES_IN * 60 * 1000),
    maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
const refreshTokenCookieOptions = {
    expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES_IN * 60 * 1000),
    maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield auth_service_1.default.register(req.body);
        res.status(200).json({
            data: result,
        });
    }
    catch (e) {
        next(e);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield auth_service_1.default.login(req.body);
        // Send Access Token in Cookie
        res.cookie("access_token", result.access_token, accessTokenCookieOptions);
        res.cookie("refresh_token", result.refresh_token, refreshTokenCookieOptions);
        res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        res.status(200).json({
            data: result,
        });
    }
    catch (e) {
        next(e);
    }
});
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refresh_token;
        console.log(req.query);
        if (req.cookies.refresh_token) {
            refresh_token = req.cookies.refresh_token;
        }
        else if (req.query && req.query.refresh_token) {
            refresh_token = req.query.refresh_token;
        }
        if (!refresh_token) {
            return next(new response_error_1.ResponseError(401, "You are not logged in"));
        }
        const data = yield auth_service_1.default.refreshAccessTokenHandler(refresh_token);
        // Send Access Token in Cookie
        // @ts-ignore
        res.cookie("access_token", data.access_token, accessTokenCookieOptions);
        res.cookie("refresh_token", 
        // @ts-ignore
        data.refresh_token, refreshTokenCookieOptions);
        res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        res.status(200).json({
            data: data,
        });
    }
    catch (e) {
        next(e);
    }
});
exports.default = {
    register,
    login,
    refreshAccessToken,
};
