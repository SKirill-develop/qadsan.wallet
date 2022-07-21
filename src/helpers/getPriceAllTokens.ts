export const getPriceTokensAll = async () => {
  return fetch("/api/getPrices")
  .then(res => res.json())
  .then(res => res)
  .catch((err) =>console.log(err));
};