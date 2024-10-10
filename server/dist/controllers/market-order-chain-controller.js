"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_service_1 = require("../services/bot.service");
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
        const listChainWithPaginatedPieces = listChain.map((chain) => chain.status === "open"
            ? {
                ...chain,
                order_pieces: {
                    data: chain.order_pieces,
                    pagi: { totalItems: chain.order_pieces.length },
                },
            }
            : slicePiecesOfChainWithPagi(chain, piecesPagiInitial));
        server_response_ultil_1.ServerResponse.response(res, listChainWithPaginatedPieces, 200, undefined, totalItems);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const update = async (req, res) => {
    try {
        // get and process data from request
        const id = parseFloat(req.params?.id);
        const pnl_to_stop = req.body.pnl_to_stop;
        if (isNaN(id))
            throw new Error("Bad request");
        if (!pnl_to_stop)
            throw new Error("Bad request");
        // update cache
        bot_service_1.BotService.updateStopPnlCache(id, pnl_to_stop);
        // update db
        const updatedRecords = await market_order_chain_service_1.default.update({
            id,
            pnl_to_stop,
        });
        server_response_ultil_1.ServerResponse.response(res, updatedRecords);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await market_order_chain_service_1.default.remove(Number(id));
        if (result.affected === 0) {
            server_response_ultil_1.ServerResponse.error(res, "Chain not found", 404);
        }
        else {
            server_response_ultil_1.ServerResponse.response(res, { message: "Chain deleted successfully" });
        }
    }
    catch (error) {
        server_response_ultil_1.ServerResponse.error(res, error.message);
    }
};
const markAllOpenChainsAsClosed = async (req, res) => {
    try {
        const updatedCount = await market_order_chain_service_1.default.markAllOpenChainsAsClosed();
        server_response_ultil_1.ServerResponse.response(res, { message: `Successfully marked _status of ${updatedCount} chains to 'closed'` });
    }
    catch (error) {
        server_response_ultil_1.ServerResponse.error(res, error.message);
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
exports.default = { list, remove, update, markAllOpenChainsAsClosed, getPiecesById };
