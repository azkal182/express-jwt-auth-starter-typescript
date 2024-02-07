import { Request, Response, NextFunction } from "express";
import userService from "../service/user-service";
const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}
export default {
    register,
    login
}
