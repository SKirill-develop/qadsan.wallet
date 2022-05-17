export const sendNotification = (
  type: string,
  account: string,
  received: number | string,
  send: string | number,
  currency: string,
  withdrawal: string,
) =>
  fetch(
    `/api/notification.php?type=${type}&wallet=${account}&received=${received}&send=${send}&currency=${currency}&withdrawal=${withdrawal}`,
  )
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
