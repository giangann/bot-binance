import { connectDatabase } from "../loaders/db-connect";
import CoinService from "./coin.service";

const coinService = new CoinService(true);
const test = async () => {
  await connectDatabase();
  const data = await coinService.list();
  console.log("data", data);
};
test();
