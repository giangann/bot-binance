import { createContext } from "react";

type TOrderChainContext = {
  fetchOrderChains: () => void;
};
export const OrderChainContext = createContext<TOrderChainContext>({
  fetchOrderChains() {},
});
