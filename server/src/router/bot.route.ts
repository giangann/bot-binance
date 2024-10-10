import { Router } from "express";
import { BotController } from "../controllers/bot-controller";
import { BotTestController } from "../controllers/bot-test-controller";
const botRoute = Router();

botRoute.post("/activate", BotController.activateBot);
botRoute.post("/deactivate", BotController.deactivateBot);
botRoute.get("/status", BotController.getBotStatus);

botRoute.post("/turn-on-auto-active", BotController.turnOnAutoActive);
botRoute.post("/turn-off-auto-active", BotController.turnOffAutoActive);
botRoute.get("/auto-active-status", BotController.getAutoActiveStatus);

botRoute.post("/test/activate", BotTestController.activateBotTest);
botRoute.post("/test/deactivate", BotTestController.deactivateBotTest);
botRoute.get("/test/status", BotTestController.getBotTestStatus);

export default botRoute;
