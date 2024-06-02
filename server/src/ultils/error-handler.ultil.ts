// @ts-nocheck
import { AxiosError } from "axios";
import { stackTraceShorter } from "./helper.ultil";
import loggerService from "../services/logger.service";

// convert Node Error object to string
export function errorToString(err: Error) {
  const { name, message, cause, stack } = err;
  const shortStackTrace = stackTraceShorter(stack);
  return `NAME: ${name} | MESSAGE: ${message} | CAUSE: ${cause} | STACK: ${shortStackTrace}`;
}

// validate error: all the error type to the same format as Node Error object
// constrain: AxiosError is instance of Error but not vice versa
export function throwError(err: any, causeCustom?: string) {
  // so keep the conditional's order:
  // 1. check if err is instance of AxiosError
  // 2. if err is not instance of AxiosError nnso check if instance of Error

  // 1.
  if (err instanceof AxiosError) {
    // get error information as data from response of Axios request
    const responseData = err.response.data;

    // parse to message string
    const errMsg = JSON.stringify(responseData);

    // constructor new Error object
    const newErr = new Error(errMsg, { cause: causeCustom });

    throw newErr;
  }

  // 2.
  if (err instanceof Error) {
    const { cause } = err;
    if (!cause) err.cause = causeCustom;
    throw err;
  }
}

// 1. emit Error information to client
// 2. save Error information to error.log file
export function handleTickError(err: any) {
  if (err instanceof Error) {
    global.wsServerGlob.emit("app-err", JSON.stringify(err.message));
  } else {
    // exception
    global.wsServerGlob.emit(
      "app-err",
      "Uncommon Error Exception, view detail in error.log file"
    );
  }
  loggerService.saveErrorLog(err);
}
