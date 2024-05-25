"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOurUser = void 0;
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const isOurUser = async (req, res, next) => {
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
    }
    catch (e) {
        server_response_ultil_1.ServerResponse.error(res, e?.message || "Backend Err");
    }
};
exports.isOurUser = isOurUser;
