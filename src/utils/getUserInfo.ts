export const getUserInfo = (wallet: string) =>
  fetch(
    `/api/getUserInfo`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({wallet})})
    .then((response) => response.json())
    .catch((err) => console.error(err));

export const getUserPartners = (wallet: string, action: string) =>
  fetch(
    `/api/getUserPartners`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({wallet, action})})
    .then((response) => response.json())
    .catch((err) => console.error(err));