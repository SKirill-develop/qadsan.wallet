export const sendNotification = (
  account: string,
  summa: number,
  qadsan: string,
  currency: string,
) =>
  fetch(
    `/api/notification.php?wallet=${account}&summa=${summa}&qadsan=${qadsan}&currency=${currency}`,
  )
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
