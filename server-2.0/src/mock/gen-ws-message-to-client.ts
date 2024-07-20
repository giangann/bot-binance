import moment from "moment";

// Function to generate a random float within a range
const getRandomFloat = (min: number, max: number, decimals = 2) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

// Function to generate a random integer within a range
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate random data
export const genWsMessageToClient = () => {
  const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT"];
  const directions = ["BUY", "SELL"];
  const randomSymbol = symbols[getRandomInt(0, symbols.length - 1)];
  const randomDirection = directions[getRandomInt(0, directions.length - 1)];

  return {
    id: `00${getRandomInt(2, 99)}`, // Generate a random id like "002", "003", etc.
    symbol: randomSymbol,
    direction: randomDirection,
    quantity: getRandomFloat(0.001, 10, 3).toString(),
    price: getRandomFloat(1000, 50000, 2).toString(),
    percent_change: getRandomFloat(-10, 10, 2).toString(),
    transaction_size: getRandomFloat(0, 1000, 2).toString(),
    market_order_chains_id: global.openingChain.id, // keep this
    order_chain: global.openingChain,
    timestamp: Date.now().toString(),
    total_balance: getRandomFloat(0, 100, 2).toString(),
    createdAt: moment(Date.now()).format("DD/MM/YYYY HH:mm:ss"),
    updatedAt: moment(Date.now()).format("DD/MM/YYYY HH:mm:ss"),
  };
};
