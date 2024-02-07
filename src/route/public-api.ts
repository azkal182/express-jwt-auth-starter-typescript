import express from "express";
import authController from "../controller/auth-controller";

const publicRouter = express.Router();
publicRouter.post("/api/auth/register", authController.register);
publicRouter.post("/api/auth/login", authController.login);

// refresh token
publicRouter.get("/api/auth/refresh", authController.refreshAccessToken);

publicRouter.get("/", (req, res) => {
  res.send("oke");
});

export { publicRouter };
