import { BotService } from "../services/bot.service";
import IController from "../interfaces/IController";
import { IMarketOrderChainEntity } from "../interfaces/market-order-chain.interface";
import { IMarketOrderPieceRecord } from "../interfaces/market-order-piece.interface";
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
      chain.status === "open"
        ? {
            ...chain,
            order_pieces: {
              data: chain.order_pieces,
              pagi: { totalItems: chain.order_pieces.length },
            },
          }
        : slicePiecesOfChainWithPagi(chain, piecesPagiInitial)
    );

    ServerResponse.response(res, listChainWithPaginatedPieces, 200, undefined, totalItems);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const update: IController = async (req, res) => {
  try {
    // get and process data from request
    const id = parseFloat(req.params?.id as string);
    const pnl_to_stop = req.body.pnl_to_stop;

    if (isNaN(id)) throw new Error("Bad request");
    if (!pnl_to_stop) throw new Error("Bad request");

    // update cache
    BotService.updateStopPnlCache(id, pnl_to_stop);

    // update db
    const updatedRecords = await marketOrderChainService.update({
      id,
      pnl_to_stop,
    });
    ServerResponse.response(res, updatedRecords);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const remove: IController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await marketOrderChainService.remove(Number(id));

    if (result.affected === 0) {
      ServerResponse.error(res, "Chain not found", 404);
    } else {
      ServerResponse.response(res, { message: "Chain deleted successfully" });
    }
  } catch (error) {
    ServerResponse.error(res, error.message);
  }
};

const markAllOpenChainsAsClosed: IController = async (req, res) => {
  try {
    const updatedCount = await marketOrderChainService.markAllOpenChainsAsClosed();
    ServerResponse.response(res, { message: `Successfully marked _status of ${updatedCount} chains to 'closed'` });
  } catch (error: any) {
    ServerResponse.error(res, error.message);
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

function pagiPiecesOfChain(pieces: IMarketOrderPieceRecord[], pagi: { page: number; perpage: number }): IMarketOrderPieceRecord[] {
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

const slicePiecesOfChainWithPagi = (chain: IMarketOrderChainEntity, pagi: { page: number; perpage: number }) => {
  return {
    ...chain,
    order_pieces: {
      data: pagiPiecesOfChain(chain.order_pieces, pagi),
      pagi: { totalItems: chain.order_pieces.length },
    },
  };
};

export default { list, remove, update, markAllOpenChainsAsClosed, getPiecesById };
