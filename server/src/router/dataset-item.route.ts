import express from "express";
import datasetItemController from "../controllers/dataset-item.controller";

const datasetItemRoute = express.Router();
datasetItemRoute.delete("/:id", datasetItemController.remove);

export default datasetItemRoute;
