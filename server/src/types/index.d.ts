/* eslint-disable no-var */

// global augmentation (same behavior and limit like module augmentation)
// add declaration to global scope
import { TWsServer } from "./socket";

declare global {
  var wsServerGlob: TWsServer;
}
export { };

