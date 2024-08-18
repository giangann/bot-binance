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

export interface IDatasetItemRecord {
  id: number;
  datasets_id: number;
  symbol: string;
  ticker_price?: string;
  market_price?: string;
  order: number;

  createdAt: string;
  updatedAt: string;
}

export interface IDatasetItemEntity extends IDatasetItemRecord {
  dataset: IDatasetRecord;
}

export interface IDatasetItemCreate extends Omit<IDatasetItemRecord, "id" | "createdAt" | "updatedAt"> {
  createdAt?: string;
  updatedAt?: string;
}

export interface IDatasetItemUpdate extends Partial<Omit<IDatasetItemRecord, "id">>, Pick<IDatasetItemRecord, "id"> {}
