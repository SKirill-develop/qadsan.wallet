export const sendRewardForSwap = (
  wallet: string,
  amount: string,
  code: string,
  issuer: string,
  ) =>
  fetch(
    `/api/rewardForSwap`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({wallet, amount, code, issuer})})
    .then((response) => response.json())
    .catch((err) => err.json());

export const sendRewardForSwapPartner = (
  wallet: string,
  amount: string,
  code: string,
  issuer: string,
  ) =>
  fetch(
    `/api/rewardForSwapPartner`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({wallet,  amount, code, issuer})})
    .then((response) => response.json())
    .catch((err) => err.json());