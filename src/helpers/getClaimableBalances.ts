import { ClaimableBalance, ClaimableBalanceRecord } from "types/types.d";

interface GetClaimableBalancesProps {
  server: any;
  publicKey: string;
}

export const getClaimableBalances = async ({
  server,
  publicKey,
}: GetClaimableBalancesProps): Promise<ClaimableBalance[]> => {
  const claimableBalancesResponse = await server
    .claimableBalances()
    .claimant(publicKey)
    .limit(200)
    .order("desc")
    .call();

  return (claimableBalancesResponse.records || []).map(
    (cb: ClaimableBalanceRecord) => {
      const { id, asset, amount, sponsor, claimants } = cb;
      const [assetCode, assetIssuer] = asset.split(":");

      return {
        id,
        asset: {
          code: assetCode,
          issuer: assetIssuer,
        },
        amount,
        sponsor,
        claimants,
      };
    },
  );
};
