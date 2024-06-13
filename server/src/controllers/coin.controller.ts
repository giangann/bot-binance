import IController from "IController";
import CoinService from "../services/coin.service";
import axios from "axios";
import { TSymbolMarkPrice } from "../types/symbol-mark-price";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import { mergeTicerPriceAndMarketPriceBySymbol } from "../ultils/helper.ultil";
import { ServerResponse } from "../ultils/server-response.ultil";

const testnetUrl = "https://testnet.binancefuture.com";
const futureUrl = "https://fapi.binance.com";

const updatePrice: IController = async (req, res) => {
  try {
    // update Testnet table
    const testnetUpdated = await updatePriceTable(true);
    // update Future table
    const futureUpdated = await updatePriceTable(false);

    ServerResponse.response(res, { testnetUpdated, futureUpdated });
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

// Logic of update:
// 1. Truncate table
// 2. Fetch data Api
// 3. Insert fetched data from Api to table

async function updatePriceTable(isTestnet: boolean) {
  const coinService = new CoinService(isTestnet);
  // fetch data api
  const symbolMarkPrices = await fetchMarkPrices(isTestnet);
  const symbolTickerPrices = await fetchTickerPrices(isTestnet);
  // truncate
  await coinService.truncate();
  // insert data
  const mergePrices = mergeTicerPriceAndMarketPriceBySymbol(
    symbolTickerPrices,
    symbolMarkPrices
  );
  const createdDatas = await Promise.all(
    mergePrices.map((price) => {
      const params = {
        symbol: price.symbol,
        price: price.price,
        mark_price: price.markPrice,
      };
      coinService.create(params);
    })
  );
  return createdDatas;
}

async function fetchMarkPrices(
  isTestnet: boolean
): Promise<TSymbolMarkPrice[]> {
  const endpoint = "/fapi/v1/premiumIndex";
  const url = `${isTestnet ? testnetUrl : futureUrl}${endpoint}`;
  const response = await axios.get(url);
  const markPrices: TSymbolMarkPrice[] = response.data;
  return markPrices;
}

async function fetchTickerPrices(
  isTestnet: boolean
): Promise<TSymbolPriceTicker[]> {
  const endpoint = "/fapi/v2/ticker/price";
  const url = `${isTestnet ? testnetUrl : futureUrl}${endpoint}`;
  const response = await axios.get(url);
  const tickersPrice: TSymbolPriceTicker[] = response.data;
  return tickersPrice;
}

export default { updatePrice };
