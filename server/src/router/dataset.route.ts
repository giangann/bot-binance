import express from "express";
import datasetController from "../controllers/dataset.controller";

const datasetRoute = express.Router();
datasetRoute.get("/", datasetController.list);
datasetRoute.get("/:id", datasetController.detail);
datasetRoute.post("/", datasetController.create);
datasetRoute.delete("/:id", datasetController.remove);
datasetRoute.patch("/:id", datasetController.update);

export default datasetRoute;
