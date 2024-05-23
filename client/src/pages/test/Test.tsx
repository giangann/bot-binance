export const Test = () => {
  const promise1 = genPromise(1, 2);
  const promise2 = genPromise(2, 2.9);
  const promise3 = genPromise(3, 1);

  const promises = [promise1, promise2, promise3];

  getPromises(promises);
  return <>Test</>;
};

const getPromise = async (promise: Promise<string>) => {
  try {
    const response = await promise;
    console.log(response);
  } catch (err: any) {
    console.log("promise err", err);
  }
};

const getPromises = async (promises: Promise<string>[]) => {
  const start = Date.now();
  try {
    const response = await Promise.all(promises);

    console.log(response);
  } catch (err) {
    console.log("err", err);
  } finally {
    console.log("time: ", Date.now() - start,'ms');
  }
};

const genPromise = async (id: number, seconds: number) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (id ===1 || id ===2) reject(`promise ${id} failure`)
      resolve(`promise ${id} success`);
    }, seconds * 1000);
  });
};
