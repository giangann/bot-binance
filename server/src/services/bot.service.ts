import moment from "moment";
import marketOrderChainService from "./market-order-chain.service";


async function getChainOpen() {
  const listOpenOrder = await marketOrderChainService.list({ status: "open" });

  return listOpenOrder[0];
}
async function updateOrderChain(total_balance_end: number) {
  try {
    const chainIsOpen = await getChainOpen();
    const { total_balance_start } = chainIsOpen;

    const updatedRes = await marketOrderChainService.update({
      id: chainIsOpen.id,
      total_balance_end: total_balance_end.toString(),
      percent_change: (
        total_balance_end / parseFloat(total_balance_start)
      ).toString(),
      price_end: "0.000",
      status: "closed",
      updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return updatedRes;
  } catch (err) {
    console.log("err updateOrderChain", err);
  }
}

const quit = async () => {
  const totalBalanceNow = global.totalBalancesUSDT;
  await updateOrderChain(totalBalanceNow);

  //   ws emit quit bot
  wsServerGlob.emit("bot-quit", "bot was quited");
};

export default {
  quit,
};
