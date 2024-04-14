import { Prisma } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { signJwt, verifyJwt } from "../utils/jwt";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation";
import { validate } from "../validation/validation";
import { hash, compareSync, hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { omit } from "lodash";
import redisClient from "../utils/connectRedis";
import { CookieOptions, NextFunction, Request, Response } from "express";
import userService from "./user-service";

// Exclude this fields from the response
export const excludedFields = ["password"];

const signToken = async (user: Prisma.UserSelect) => {
  // Sign the access token
  const access_token = signJwt(
    omit(user, excludedFields),
    "accessTokenPrivateKey",
    {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
    }
  );

  // Sign the refresh token
  const refresh_token = signJwt({ id: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}m`,
  });

  // Create a Session
  redisClient.set(String(user.id), JSON.stringify(omit(user, excludedFields)), {
    EX: 60 * 60,
  });
  // Return access token
  return { access_token, refresh_token };
};

const register = async (request: any) => {
  const data = validate(registerUserValidation, request);
  console.log({ data });

  try {
    data.password = hashSync(data.password, 10);
    const user = await prismaClient.user.create({ data });
    console.log(user);
    return omit(user, ["password"]);
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new ResponseError(
        409,
        "There is a unique constraint violation, a new user cannot be created with this username"
      );
    }

    console.log(err);
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
};

const login = async (request: any) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const isPasswordValid = compareSync(loginRequest.password, user.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }
  // @ts-ignore
  const { access_token, refresh_token } = await signToken(user);

  return { user: omit(user, ["password"]), access_token, refresh_token };
};

const refreshAccessTokenHandler = async (refresh_token: string) => {
  try {
    // Validate the Refresh token
    const decoded = verifyJwt<{ id: string }>(
      refresh_token,
      "refreshTokenPublicKey"
    );
    const message = "Could not refresh access token";
    if (!decoded) {
      return new ResponseError(403, message);
    }

    // Check if the user has a valid session
    const session = await redisClient.get(decoded.id);
    if (!session) {
      return new ResponseError(403, message);
    }

    // Check if the user exist
    const user = await userService.findUserById(JSON.parse(session).id);
    if (!user) {
      return new ResponseError(403, message);
    }

    const { access_token, refresh_token: new_refresh_token } = await signToken(
      // @ts-ignore
      user
    );

    return { access_token, refresh_token: new_refresh_token };
  } catch (err: any) {
    return new ResponseError(403, "Could not refresh access token");
  }
};
export default {
  register,
  login,
  refreshAccessTokenHandler,
};
