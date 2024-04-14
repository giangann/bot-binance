const main = async () => {
  let num = 0;
  let now = Date.now();
  const interval = setInterval(() => {
    if (num === 5) clearInterval(interval);
    else {
      console.log("hello");
      console.log(currNow() - now);
    }
    num = num + 1;
  }, 2000);
};

function currNow() {
  return Date.now();
}
const fakeDelay = async (seconds: number) => {
  const promise = new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
  return promise;
};

export { fakeDelay };

// main();
