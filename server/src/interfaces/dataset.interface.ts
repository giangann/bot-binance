import { IDatasetItemCreate, IDatasetItemRecord, IDatasetItemUpdate } from "./dataset-item.interface";

export interface IDatasetRecord {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDatasetEntity extends IDatasetRecord {
  dataset_items: IDatasetItemRecord[];
}

export interface IDatasetCreate {
  dataset_items?: IDatasetItemCreate[];
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDatasetUpdate extends Pick<IDatasetRecord, "id"> {
  dataset_items?: (IDatasetItemUpdate | IDatasetItemCreate)[];
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}
