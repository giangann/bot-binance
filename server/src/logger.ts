import { logger } from "./loaders/logger.config";
import { errorToString } from "./services/logger.service";

export class Logger {
  /**
   * log
   */
  public log(message: string) {
    console.log(`[LOG]: ${message}`);
  }

  public debug(message: string) {
    logger.debug(message);
  }

  public debugAndLog(message: string) {
    logger.debug(message);
    console.log(`[LOG]: ${message}`);
  }

  public saveError(error: any) {
    if (error instanceof Error) {
      const content = errorToString(error);
      logger.error(content);
    } else {
      const errorKeys = Object.keys(error);
      const errorProperties = Object.getOwnPropertyNames(error);
      const content = `Uncommon Error Exception with Keys: ${errorKeys} --and-- Properties: ${errorProperties}`;
      logger.error(content);
    }
  }
}
