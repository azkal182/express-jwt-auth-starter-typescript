import { Request, Response, NextFunction, CookieOptions } from "express";
import authService from "../service/auth-service";
import { ResponseError } from "../error/response-error";

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + (process.env.ACCESS_TOKEN_EXPIRES_IN as any) * 60 * 1000
  ),
  maxAge: (process.env.ACCESS_TOKEN_EXPIRES_IN as any) * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + (process.env.REFRESH_TOKEN_EXPIRES_IN as any) * 60 * 1000
  ),
  maxAge: (process.env.REFRESH_TOKEN_EXPIRES_IN as any) * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);

    // Send Access Token in Cookie
    res.cookie("access_token", result.access_token, accessTokenCookieOptions);
    res.cookie(
      "refresh_token",
      result.refresh_token,
      refreshTokenCookieOptions
    );
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let refresh_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      refresh_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.refresh_token) {
      refresh_token = req.cookies.refresh_token;
    }

    if (!refresh_token) {
      return next(new ResponseError(401, "You are not logged in"));
    }

    const data = await authService.refreshAccessTokenHandler(refresh_token);

    // Send Access Token in Cookie
    // @ts-ignore
    res.cookie("access_token", data.access_token, accessTokenCookieOptions);
    res.cookie(
      "refresh_token",
      // @ts-ignore
      data.refresh_token,
      refreshTokenCookieOptions
    );
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    res.status(200).json({
      data: data,
    });
  } catch (e) {
    next(e);
  }
};
export default {
  register,
  login,
  refreshAccessToken,
};
