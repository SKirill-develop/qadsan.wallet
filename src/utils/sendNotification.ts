export const sendNotification = (
  type: string,
  account: string,
  received: number | string,
  send: string | number,
  currency: string,
  withdrawal: string,
) =>
  fetch(
    `/api/notifications`,
  {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type,
    account,
    received,
    send,
    currency,
    withdrawal,
  })})
    .then((response) => response.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
