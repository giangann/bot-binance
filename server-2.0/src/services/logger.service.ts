import { logger } from "../loaders/logger.config";

const saveError = (error: any) => {
  if (error instanceof Error) {
    const content = errorToString(error);
    logger.error(content);
  } else {
    const errorKeys = Object.keys(error);
    const errorProperties = Object.getOwnPropertyNames(error);
    const content = `Uncommon Error Exception with Keys: ${errorKeys} --and-- Properties: ${errorProperties}`;
    logger.error(content);
  }
};

export function errorToString(err: Error) {
  const { name, message, cause, stack } = err;
  const shortStackTrace = stackTraceShorter(stack);
  return `NAME: ${name} | MESSAGE: ${message} | CAUSE: ${cause} | STACK: ${shortStackTrace}`;
}

export function stackTraceShorter(trace: string): string {
  const traceArr = trace.split("\n    ");

  const firstTrace = traceArr[traceArr.length - 1];
  const secondTrace = traceArr[traceArr.length - 2];
  const thirdTrace = traceArr[traceArr.length - 3];

  return `${firstTrace}  -  ${secondTrace}  -  ${thirdTrace}`;
}

export default { saveError };
