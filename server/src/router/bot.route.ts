import { Router } from "express";
import botController from "../controllers/bot.controller";
const botRoute = Router();

botRoute.post("/active", botController.active);
botRoute.get("/quit", botController.quit);

export default botRoute;
