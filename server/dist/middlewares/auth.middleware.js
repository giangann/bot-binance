"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOurUser = void 0;
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const isOurUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        server_response_ultil_1.ServerResponse.error(res, (e === null || e === void 0 ? void 0 : e.message) || "Backend Err");
    }
});
exports.isOurUser = isOurUser;
