import {
  ClaimableBalanceStats,
  ClaimableBalanceStatsRecord,
} from "types/types.d";
import { QADSAN_ASSET } from "../constants/settings";

interface GetClaimableBalancesStatsProps {
  server: any;
  wallet: string;
}

export const getClaimableBalancesStats = async ({
  server,
  wallet,
}: GetClaimableBalancesStatsProps): Promise<ClaimableBalanceStats[]> => {
  let claimableBalancesStatsResponse = await server
    .claimableBalances()
    .sponsor(wallet)
    .asset(QADSAN_ASSET)
    .limit(200)
    .order("desc")
    .call();

  const accumulated: any = [];
  let amountRecords: any = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    amountRecords = await claimableBalancesStatsResponse;
    amountRecords.records.forEach((item: any) => {
      accumulated.push(item);
    });

    claimableBalancesStatsResponse = amountRecords.next();
  } while (amountRecords.records.length > 0);

  return (accumulated || []).map((cb: ClaimableBalanceStatsRecord) => {
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
  });
};
