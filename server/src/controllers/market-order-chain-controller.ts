import IController from "IController";
import { IMarketOrderChainEntity } from "market-order-chain.interface";
import { IMarketOrderPieceRecord } from "market-order-piece.interface";
import logService from "../services/log.service";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";

const list: IController = async (req, res) => {
  try {
    const listChain = await marketOrderChainService.list();

    const piecesPagiInitial = {
      page: 1,
      perpage: 5,
    };

    const totalItems = listChain.length;

    const listChainWithPaginatedPieces = listChain.map((chain) =>
      slicePiecesOfChainWithPagi(chain, piecesPagiInitial)
    );

    ServerResponse.response(
      res,
      listChainWithPaginatedPieces,
      200,
      null,
      totalItems
    );
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getPiecesById: IController = async (req, res) => {
  try {
    const chainId = req.query?.chain_id;
    const page = req.query?.page;
    const perpage = req.query?.perpage;

    if (!chainId) throw new Error("Bad Request");

    const chainIdInt = parseInt(chainId as string);
    const pageInt = parseInt((page ?? "1") as string);
    const perpageInt = parseInt((perpage ?? "5") as string);

    const pagi = {
      page: pageInt,
      perpage: perpageInt,
    };

    const chain = await marketOrderChainService.detail(chainIdInt);
    const chainWithPaginatedPieces = slicePiecesOfChainWithPagi(chain, pagi);

    ServerResponse.response(res, chainWithPaginatedPieces, 200, null);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const isBotActive: IController = async (req, res) => {
  try {
    const openChain = await marketOrderChainService.list({ status: "open" });

    ServerResponse.response(res, openChain.length);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getLogs: IController = async (req, res) => {
  try {
    const chainId = parseInt(req.params?.chainId);
    const logs = await logService.list({ market_order_chains_id: chainId });
    ServerResponse.response(res, logs);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

function pagiPiecesOfChain(
  pieces: IMarketOrderPieceRecord[],
  pagi: { page: number; perpage: number }
): IMarketOrderPieceRecord[] {
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

const slicePiecesOfChainWithPagi = (
  chain: IMarketOrderChainEntity,
  pagi: { page: number; perpage: number }
) => {
  return {
    ...chain,
    order_pieces: {
      data: pagiPiecesOfChain(chain.order_pieces, pagi),
      pagi: { totalItems: chain.order_pieces.length },
    },
  };
};
export default { list, getPiecesById, getLogs, isBotActive };
