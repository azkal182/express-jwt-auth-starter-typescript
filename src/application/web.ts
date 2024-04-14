import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { publicRouter } from "../route/public-api";
import { errorMiddleware } from "../middleware/error-middleware";
import { userRouter } from "../route/api";
import cookieParser from "cookie-parser";
import cors from "cors";
import moment from "moment-timezone";

export const web = express();
web.use(express.json());
web.use(cookieParser());
moment.tz.setDefault("Asia/Jakarta");

web.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
