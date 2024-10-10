import { TBinanceError } from "../rest-api";

export type TRateLimit = {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
  count: number;
};
export type TWsApiResponse<T> = {
  id: string;
  status: number;
  result?: T;
  error?: TBinanceError;
  rateLimits: TRateLimit[];
};
