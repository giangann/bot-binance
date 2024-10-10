import { TPosition } from "./position.type";

export type TAccount = {
  feeTier: number; // account commission tier
  canTrade: boolean; // if can trade
  canDeposit: boolean; // if can transfer in asset
  canWithdraw: boolean; // if can transfer out asset
  updateTime: number; // reserved property, please ignore
  multiAssetsMargin: boolean;
  tradeGroupId: number;
  totalInitialMargin: string; // total initial margin required with current mark price (useless with isolated positions), only for USDT asset
  totalMaintMargin: string; // total maintenance margin required, only for USDT asset
  totalWalletBalance: string; // total wallet balance, only for USDT asset
  totalUnrealizedProfit: string; // total unrealized profit, only for USDT asset
  totalMarginBalance: string; // total margin balance, only for USDT asset
  totalPositionInitialMargin: string; // initial margin required for positions with current mark price, only for USDT asset
  totalOpenOrderInitialMargin: string; // initial margin required for open orders with current mark price, only for USDT asset
  totalCrossWalletBalance: string; // crossed wallet balance, only for USDT asset
  totalCrossUnPnl: string; // unrealized profit of crossed positions, only for USDT asset
  availableBalance: string; // available balance, only for USDT asset
  maxWithdrawAmount: string;
  assests: Record<string, unknown>;
  positions?: TPosition;
};
