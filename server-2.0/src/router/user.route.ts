import userController from "../controllers/user.controller";
import express from "express";

const userRoute = express.Router();

userRoute.get("/acc-info-axios", userController.getAccInfo);
userRoute.get("/acc-info-fetch", userController.getAccInfo);

userRoute.get("/position-info", userController.getPosition);

export default userRoute;
