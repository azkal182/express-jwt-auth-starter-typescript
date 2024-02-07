import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../error/response-error";
import { verifyJwt } from "../utils/jwt";
import redisClient from "../utils/connectRedis";
import userService from "../service/user-service";
import { omit } from "lodash";
import { excludedFields } from "../service/auth-service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      // throw new ResponseError(401, "You are not logged in")
      return next(new ResponseError(401, "You are not logged in"));
    }

    // Validate Access Token
    const decoded = verifyJwt<{ id: string }>(
      access_token,
      "accessTokenPublicKey"
    );

    if (!decoded) {
      return next(
        new ResponseError(401, `Invalid token or user doesn't exist`)
      );
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.id);
    console.log({ session });

    if (!session) {
      return next(new ResponseError(401, `User session has expired`));
    }
    // console.log({ session, decoded });

    // Check if user still exist
    const user = await userService.findUserById(JSON.parse(session).id);

    if (!user) {
      return next(
        new ResponseError(401, `User with that token no longer exist`)
      );
    }

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = omit(user, excludedFields);

    next();
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};
