import { TBinanceError } from "./binance-error.type";

export type TResponse<T> = T | TBinanceError;
