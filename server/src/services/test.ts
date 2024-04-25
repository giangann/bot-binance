import axios from "axios";
import dotenv from "dotenv";
import { createHmac } from "crypto";

dotenv.config();
const baseUrl = process.env.BINANCE_BASE_URL;
const secret = process.env.BINANCE_SECRET;
const apiKey = process.env.BINANCE_API_KEY;

const sandBoxMode = process.env.BINANCE_SANDBOX_MODE;

const getAccInfo = async () => {
  let params: Record<string, unknown> = {
    recvWindow: 5000,
    timestamp: Date.now(),
  };
  const queryString = paramsToQueryWithSignature(secret, params);

  const response = await axios.get(
    `${baseUrl}/fapi/v2/account?${queryString}`,
    {
      headers: { "X-MBX-APIKEY": apiKey },
    }
  );

  console.log("data", response.data);
};
getAccInfo();

const streamAccInfo = async () => {
  
};

//----------------------------------------------------//

function paramsToQueryWithSignature(
  binance_api_secret: string,
  paramsObject: Record<string, unknown>
): string {
  const keys = Object.keys(paramsObject).sort();
  let queryString = keys
    .map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        paramsObject[key] as string
      )}`;
    })
    .join("&");

  const hmac = createHmac("sha256", binance_api_secret);
  hmac.update(queryString);
  const signature = hmac.digest("hex");

  queryString += `&signature=${signature}`;

  return queryString;
}
