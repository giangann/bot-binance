import moment from "moment";
import marketOrderChainService from "./market-order-chain.service";

async function getChainOpen() {
  const listOpenOrder = await marketOrderChainService.list({ status: "open" });

  return listOpenOrder[0];
}
async function updateOrderChain() {
  try {
    const chainIsOpen = await getChainOpen();

    const updatedRes = await marketOrderChainService.update({
      id: chainIsOpen.id,
      total_balance_end: "0.000",
      percent_change: "0.000", // can't defined
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
  await updateOrderChain();
  //   ws emit quit bot
  wsServerGlob.emit("bot-quit", "bot was quited");
};

export default {
  quit,
};
