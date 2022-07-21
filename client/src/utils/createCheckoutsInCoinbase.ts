export const createCheckouts = (
  wallet: string,
  amountInUSD: string,
  amountInQADSAN: string,
) => {

const getId = fetch(`api/coinbase`, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    wallet,
    amountInUSD,
    amountInQADSAN,
  }),
})
  .then((response) => response.json())
  .then((response) =>  response.id)
  .catch((err) => console.error(err));
  return getId;
};
