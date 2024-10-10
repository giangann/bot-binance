import { IDatasetItemRecord } from "../../interfaces/dataset-item.interface";
import { IMarketOrderChainCreate } from "../../interfaces/market-order-chain.interface";

export type TBotTestConfig = IMarketOrderChainCreate & Pick<IDatasetItemRecord, "datasets_id">;
export type TBotConfig = IMarketOrderChainCreate;

export type TSymbolPnlManaging = {
  is_max_pnl_start_reached: boolean;
  max_pnl_start: string;
};

export type TSymbolPnlManagingsMap = Record<string, TSymbolPnlManaging>;
