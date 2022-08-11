export const rewardPayment = (
  wallet: string,
  amount: string,
  name: string,
  issuer: string,
  userId: number | null,
  partner: string | null,
  googleTokens: string,
) =>
  fetch(`/api/reward`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wallet,
      amount,
      name,
      issuer,
      userId,
      partner,
      googleTokens,
    }),
  })
    .then((response) => response.json())
    .catch((err) => err.json());

export const getTopUsers = () =>
  fetch(`/api/getTopUsers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .catch((err) => err.json());
