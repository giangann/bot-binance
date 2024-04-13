const newInterval = (cb: Function, seconds: number) => {
  const intervalId = setInterval(cb, seconds * 1000);
  return intervalId;
};

let num = 1;

const hello = (intervalId: any) => {
  console.log("hello world");

  if (num === 3) clearInterval(intervalId);
};

const main = async () => {
  const intervalId = newInterval(() => {
    hello(intervalId), (num += 1);
  }, 1);
//   console.log("intervalId", intervalId);
//   await fakeDelay(5);
//   clearInterval(intervalId);
};

const fakeDelay = async (seconds: number) => {
  const promise = new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
  return promise;
};

main()