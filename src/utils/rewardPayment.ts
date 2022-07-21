export const rewardPayment = (
  wallet: string,
  amount: string,
  name: string,
  issuer: string,
  userId: number | null,
  partner: string | null,
  ) =>
  fetch(
    `/api/reward`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({wallet, amount, name, issuer, userId, partner})})
    .then((response) => response.json())
    .catch((err) => err.json());