import { NextFunction, Request, Response } from "express";
import userService from "../service/user-service";

const getMeHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getAllUser();
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
export default {
  getMeHandler,
  getAllUser,
};
