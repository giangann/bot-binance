import { MarketOrderChainTest } from "../entities/market-order-chain-test.entity";
import { MarketOrderPieceTest } from "../entities/market-order-piece-test.entity";
import IController from "../interfaces/IController";
import marketOrderChainTestService from "../services/market-order-chain-test.service";
import { ServerResponse } from "../ultils/server-response.ultil";

const list: IController = async (req, res) => {
  try {
    const listChain = await marketOrderChainTestService.list();

    const piecesPagiInitial = {
      page: 1,
      perpage: 5,
    };

    const totalItems = listChain.length;

    const listChainWithPaginatedPieces = listChain.map((chain) =>
      chain.status === "open"
        ? {
            ...chain,
            order_pieces_test: {
              data: chain.order_pieces_test,
              pagi: { totalItems: chain.order_pieces_test.length },
            },
          }
        : slicePiecesOfChainWithPagi(chain, piecesPagiInitial)
    );

    ServerResponse.response(res, listChainWithPaginatedPieces, 200, undefined, totalItems);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const remove: IController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await marketOrderChainTestService.remove(Number(id));

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
    const updatedCount = await marketOrderChainTestService.markAllOpenChainsAsClosed();
    ServerResponse.response(res, { message: `Successfully marked _status of ${updatedCount} chains to 'closed'` });
  } catch (error: any) {
    ServerResponse.error(res, error.message);
  }
};

const getPiecesById: IController = async (req, res) => {
  try {
    const chainTestId = req.query?.chain_id;
    const page = req.query?.page;
    const perpage = req.query?.perpage;

    if (!chainTestId) throw new Error("Bad Request");

    const chainTestIdInt = parseInt(chainTestId as string);
    const pageInt = parseInt((page ?? "1") as string);
    const perpageInt = parseInt((perpage ?? "5") as string);
    const pagi = {
      page: pageInt,
      perpage: perpageInt,
    };

    const chainTest = await marketOrderChainTestService.detail(chainTestIdInt);
    const chainWithPaginatedPieces = slicePiecesOfChainWithPagi(chainTest, pagi);

    ServerResponse.response(res, chainWithPaginatedPieces, 200, null);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

function pagiPiecesOfChain(pieces: MarketOrderPieceTest[], pagi: { page: number; perpage: number }): MarketOrderPieceTest[] {
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

const slicePiecesOfChainWithPagi = (chain: MarketOrderChainTest, pagi: { page: number; perpage: number }) => {
  return {
    ...chain,
    order_pieces_test: {
      data: pagiPiecesOfChain(chain.order_pieces_test, pagi),
      pagi: { totalItems: chain.order_pieces_test.length },
    },
  };
};

export default { list, remove, markAllOpenChainsAsClosed, getPiecesById };
