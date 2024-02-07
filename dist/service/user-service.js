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
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const database_1 = require("../application/database");
const auth_service_1 = require("./auth-service");
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.prismaClient.user.findUnique({
        where: {
            username,
        },
    });
    return user;
});
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.prismaClient.user.findUnique({
        where: {
            id,
        },
    });
    return user;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.prismaClient.user.findMany();
    const result = [];
    user.forEach((user) => {
        result.push((0, lodash_1.omit)(user, auth_service_1.excludedFields));
    });
    return result;
});
exports.default = {
    findUserByUsername,
    findUserById,
    getAllUser,
};
