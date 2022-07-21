/* eslint-disable arrow-body-style */
export const getPriceXlm = () => {
  return fetch("https://api.stellar.expert/explorer/public/xlm-price")
    .then((response) => response.json())
    .then((response) => response[0][1])
    .catch((err) => console.error(err));
};
