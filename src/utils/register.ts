export const savePublicKey = (wallet: string, seniorId: string | null) =>
  fetch(
    `/api/register`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({wallet, seniorId})})
    .then((response) => response.json())
    .catch((err) => console.error(err));