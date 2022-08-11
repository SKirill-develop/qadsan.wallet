export const getTransactionsForBinance = (  wallet: string ) =>
  fetch(
    `/api/binance`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ wallet})})
    .then((response) => response.json())
    .catch((err) => console.error(err));