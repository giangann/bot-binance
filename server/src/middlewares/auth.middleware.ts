import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { ServerResponse } from "../ultils/server-response.ultil";

export const isOurUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const cookie = req.headers.cookie;
    // if (!cookie) {
    //   return ServerResponse.error(res, "No cookie found, please login");
    // }

    // const userId = cookie.split("=")[1];
    // const foundUser = await userService.detail({ id: parseInt(userId) });
    // if (!foundUser) return ServerResponse.error(res, "UnAuthorized");

    // // @ts-ignore
    // req.user = foundUser;
    next();
  } catch (e) {
    ServerResponse.error(res, e?.message || "Backend Err");
  }
};
