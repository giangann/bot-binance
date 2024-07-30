import express from "express";
import autoActiveConfigController from "../controllers/auto-active-config.controller";

const autoActiveConfigRoute = express.Router();
autoActiveConfigRoute.get("/get-one", autoActiveConfigController.getOne);
autoActiveConfigRoute.put("/update-one", autoActiveConfigController.updateOne);

export default autoActiveConfigRoute;
