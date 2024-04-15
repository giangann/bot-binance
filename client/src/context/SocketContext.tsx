import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext } from "react";
import { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket<
  DefaultEventsMap,
  DefaultEventsMap
> | null>(null);
