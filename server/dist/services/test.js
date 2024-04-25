"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = require("crypto");
dotenv_1.default.config();
const baseUrl = process.env.BINANCE_BASE_URL;
const secret = process.env.BINANCE_SECRET;
const apiKey = process.env.BINANCE_API_KEY;
const sandBoxMode = process.env.BINANCE_SANDBOX_MODE;
const getAccInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    let params = {
        recvWindow: 5000,
        timestamp: Date.now(),
    };
    const queryString = paramsToQueryWithSignature(secret, params);
    const response = yield axios_1.default.get(`${baseUrl}/fapi/v2/account?${queryString}`, {
        headers: { "X-MBX-APIKEY": apiKey },
    });
    console.log("data", response.data);
});
getAccInfo();
const streamAccInfo = () => __awaiter(void 0, void 0, void 0, function* () {
});
//----------------------------------------------------//
function paramsToQueryWithSignature(binance_api_secret, paramsObject) {
    const keys = Object.keys(paramsObject).sort();
    let queryString = keys
        .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`;
    })
        .join("&");
    const hmac = (0, crypto_1.createHmac)("sha256", binance_api_secret);
    hmac.update(queryString);
    const signature = hmac.digest("hex");
    queryString += `&signature=${signature}`;
    return queryString;
}
