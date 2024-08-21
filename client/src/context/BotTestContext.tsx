import { createContext } from "react";
import { TBot } from "./BotContext";

export const BotTestContext = createContext<TBot>({
  active: false,
  onToggle(_active) {},
});
