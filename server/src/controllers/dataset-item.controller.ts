import IController from "../interfaces/IController";
import datasetItemService from "../services/dataset-item.service";
import { ServerResponse } from "../ultils/server-response.ultil";

const remove: IController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await datasetItemService.remove(Number(id));

    if (result.affected === 0) {
      ServerResponse.error(res, "Dataset not found", 404);
    } else {
      ServerResponse.response(res, { message: "Dataset deleted successfully" });
    }
  } catch (error) {
    ServerResponse.error(res, error);
  }
};

export default { remove };
