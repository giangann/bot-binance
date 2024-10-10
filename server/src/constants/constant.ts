import { TPosition } from "../types/rest-api/position.type";
import dotenv from "dotenv";
dotenv.config();

export const positionSample: TPosition = {
  symbol: "",
  positionAmt: "",
  entryPrice: "",
  breakEvenPrice: "",
  markPrice: "",
  unRealizedProfit: "",
  liquidationPrice: "",
  leverage: "",
  maxNotionalValue: "",
  marginType: "",
  isolatedMargin: "",
  isAutoAddMargin: "",
  positionSide: "",
  notional: "",
  isolatedWallet: "",
  updateTime: 0,
};

const ERROR_CODE_RM_SYMBOL_ENV = process.env.ERROR_CODE_RM_SYMBOL ?? "";
export const ERROR_CODE_RM_SYMBOL = ERROR_CODE_RM_SYMBOL_ENV.split(",").map((code) => parseInt(code) || 0);
export const BOT_RUN_INTERVAL = (parseFloat(process.env.BOT_RUN_INTERVAL) || 4) * 1000; // seconds
export const IS_LIMIT_SYMBOL = Boolean(parseFloat(process.env.IS_LIMIT_SYMBOL || "0"));
