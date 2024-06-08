"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_service_1 = __importDefault(require("../services/log.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const list = async (req, res) => {
    try {
        const listChain = await market_order_chain_service_1.default.list();
        const piecesPagiInitial = {
            page: 1,
            perpage: 5,
        };
        const totalItems = listChain.length;
        const listChainWithPaginatedPieces = listChain.map((chain) => slicePiecesOfChainWithPagi(chain, piecesPagiInitial));
        server_response_ultil_1.ServerResponse.response(res, listChainWithPaginatedPieces, 200, null, totalItems);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getPiecesById = async (req, res) => {
    try {
        const chainId = req.query?.chain_id;
        const page = req.query?.page;
        const perpage = req.query?.perpage;
        if (!chainId)
            throw new Error("Bad Request");
        const chainIdInt = parseInt(chainId);
        const pageInt = parseInt((page ?? "1"));
        const perpageInt = parseInt((perpage ?? "5"));
        const pagi = {
            page: pageInt,
            perpage: perpageInt,
        };
        const chain = await market_order_chain_service_1.default.detail(chainIdInt);
        const chainWithPaginatedPieces = slicePiecesOfChainWithPagi(chain, pagi);
        server_response_ultil_1.ServerResponse.response(res, chainWithPaginatedPieces, 200, null);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const isBotActive = async (req, res) => {
    try {
        const openChain = await market_order_chain_service_1.default.list({ status: "open" });
        server_response_ultil_1.ServerResponse.response(res, openChain.length);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getLogs = async (req, res) => {
    try {
        const page = req.query?.page;
        const perpage = req.query?.perpage;
        const pageInt = parseInt((page ?? "1"));
        const perpageInt = parseInt((perpage ?? "5"));
        const pagi = {
            page: pageInt,
            perpage: perpageInt,
        };
        const chainId = parseInt(req.params?.chainId);
        const logs = await log_service_1.default.list({
            market_order_chains_id: chainId,
        });
        const paginatedLogs = logsWithPagi(logs, pagi);
        server_response_ultil_1.ServerResponse.response(res, paginatedLogs);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
function pagiPiecesOfChain(pieces, pagi) {
    // use slice js function to return a partion of pieces array
    // example: arr = ['a','b','c','d','e','f','g','h','i','k','l','m']
    // page = 1 ; perpage = 3 => [a,b,c] <=> arr[0] to arr[2] (0,1,2) <=> slice (0,3)
    // page = 2 ; perpage = 3 => [d,e,f] <=> arr[3] to arr[5] (3,4,5) <=> slice (3,6)
    const { page, perpage } = pagi;
    const startIndex = page * perpage - perpage;
    const endIndex = page * perpage;
    const paginatedPieces = pieces.slice(startIndex, endIndex);
    return paginatedPieces;
}
const slicePiecesOfChainWithPagi = (chain, pagi) => {
    return {
        ...chain,
        order_pieces: {
            data: pagiPiecesOfChain(chain.order_pieces, pagi),
            pagi: { totalItems: chain.order_pieces.length },
        },
    };
};
function pagiLogs(logs, pagi) {
    const { page, perpage } = pagi;
    const startIndex = page * perpage - perpage;
    const endIndex = page * perpage;
    const paginatedLogs = logs.slice(startIndex, endIndex);
    return paginatedLogs;
}
const logsWithPagi = (logs, pagi) => ({
    data: pagiLogs(logs, pagi),
    pagi: { totalItems: logs.length },
});
exports.default = { list, getPiecesById, getLogs, isBotActive };
