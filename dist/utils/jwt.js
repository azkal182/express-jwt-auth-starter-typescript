"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signJwt = (payload, key, options = {}) => {
    const privateKey = Buffer.from(key === "accessTokenPrivateKey"
        ? process.env.ACCESS_TOKEN_PRIVATE_KEY
        : process.env.REFRESH_TOKEN_PRIVATE_KEY, "base64").toString("ascii");
    return jsonwebtoken_1.default.sign(payload, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: "RS256" }));
};
exports.signJwt = signJwt;
const verifyJwt = (token, key) => {
    try {
        const publicKey = Buffer.from(key === "accessTokenPublicKey"
            ? process.env.ACCESS_TOKEN_PUBLIC_KEY
            : process.env.REFRESH_TOKEN_PUBLIC_KEY, "base64").toString("ascii");
        return jsonwebtoken_1.default.verify(token, publicKey);
    }
    catch (error) {
        return null;
    }
};
exports.verifyJwt = verifyJwt;
