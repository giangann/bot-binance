import { createContext } from "react";

export type TBot = {
  active: boolean;
  onToggle: (active: boolean) => void;
};
export const BotContext = createContext<TBot>({
  active: false,
  onToggle(_active) {},
});
