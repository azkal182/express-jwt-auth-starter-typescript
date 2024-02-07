import express from "express";
import userController from "../controller/user-controller";

const publicRouter = express.Router();
publicRouter.post('/api/users/register', userController.register);
publicRouter.post('/api/users/login', userController.login);
publicRouter.get('/', (req, res) => {
    res.send("oke")
})

export {
    publicRouter
}
