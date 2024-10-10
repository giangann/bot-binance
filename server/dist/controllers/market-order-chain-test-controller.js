"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const market_order_chain_test_service_1 = __importDefault(require("../services/market-order-chain-test.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const list = async (req, res) => {
    try {
        const listChain = await market_order_chain_test_service_1.default.list();
        const piecesPagiInitial = {
            page: 1,
            perpage: 5,
        };
        const totalItems = listChain.length;
        const listChainWithPaginatedPieces = listChain.map((chain) => chain.status === "open"
            ? {
                ...chain,
                order_pieces_test: {
                    data: chain.order_pieces_test,
                    pagi: { totalItems: chain.order_pieces_test.length },
                },
            }
            : slicePiecesOfChainWithPagi(chain, piecesPagiInitial));
        server_response_ultil_1.ServerResponse.response(res, listChainWithPaginatedPieces, 200, undefined, totalItems);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await market_order_chain_test_service_1.default.remove(Number(id));
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
        const updatedCount = await market_order_chain_test_service_1.default.markAllOpenChainsAsClosed();
        server_response_ultil_1.ServerResponse.response(res, { message: `Successfully marked _status of ${updatedCount} chains to 'closed'` });
    }
    catch (error) {
        server_response_ultil_1.ServerResponse.error(res, error.message);
    }
};
const getPiecesById = async (req, res) => {
    try {
        const chainTestId = req.query?.chain_id;
        const page = req.query?.page;
        const perpage = req.query?.perpage;
        if (!chainTestId)
            throw new Error("Bad Request");
        const chainTestIdInt = parseInt(chainTestId);
        const pageInt = parseInt((page ?? "1"));
        const perpageInt = parseInt((perpage ?? "5"));
        const pagi = {
            page: pageInt,
            perpage: perpageInt,
        };
        const chainTest = await market_order_chain_test_service_1.default.detail(chainTestIdInt);
        const chainWithPaginatedPieces = slicePiecesOfChainWithPagi(chainTest, pagi);
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
        order_pieces_test: {
            data: pagiPiecesOfChain(chain.order_pieces_test, pagi),
            pagi: { totalItems: chain.order_pieces_test.length },
        },
    };
};
exports.default = { list, remove, markAllOpenChainsAsClosed, getPiecesById };
