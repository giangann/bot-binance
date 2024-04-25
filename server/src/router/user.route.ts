import userController from "../controllers/user.controller";
import express from "express";

const userRoute = express.Router();
userRoute.get("/balance", userController.getBalance);
userRoute.get("/fetch-balance", userController.getBalance);

userRoute.get("/order-history", userController.getOrderHistory);
userRoute.get("/trade-history", userController.getTradeHistory);

userRoute.get('/acc-info-axios', userController.getAccInfo)
userRoute.get('/acc-info-fetch', userController.getAccInfo)

export default userRoute;
