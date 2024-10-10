import datasetService from "../services/dataset.service";
import IController from "../interfaces/IController";
import { ServerResponse } from "../ultils/server-response.ultil";

const list: IController = async (req, res) => {
  try {
    const datasets = await datasetService.list();

    ServerResponse.response(res, datasets);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const detail: IController = async (req, res) => {
  try {
    const { id } = req.params;
    const dataset = await datasetService.detail(Number(id));

    ServerResponse.response(res, dataset);
  } catch (error) {
    ServerResponse.error(res, error.message);
  }
};

// Create a new dataset
const create: IController = async (req, res) => {
  try {
    const params = req.body;
    const createdDataset = await datasetService.create(params);
    ServerResponse.response(res, createdDataset);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const update: IController = async (req, res) => {
  try {
    const { id } = req.params;
    const params = req.body;

    // Call the dataset service to handle the update logic
    const updatedDataset = await datasetService.update({ id: Number(id), ...params });

    if (!updatedDataset) {
      ServerResponse.error(res, "Dataset not found", 404);
    } else {
      ServerResponse.response(res, updatedDataset);
    }
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

// Delete a dataset
const remove: IController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await datasetService.remove(Number(id));

    if (result.affected === 0) {
      ServerResponse.error(res, "Dataset not found", 404);
    } else {
      ServerResponse.response(res, { message: "Dataset deleted successfully" });
    }
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

export default { list, detail, create, update, remove };
