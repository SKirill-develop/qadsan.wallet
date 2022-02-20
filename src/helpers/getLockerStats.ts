import { ClaimableBalanceStats, ClaimableBalanceStatsRecord } from "types/types.d";

interface GetClaimableBalancesStatsProps {
  server: any;
  sponsors: string;
}

export const getClaimableBalancesStats = async ({
  server,
  sponsors,
}: GetClaimableBalancesStatsProps): Promise<ClaimableBalanceStats[]> => {
  let claimableBalancesStatsResponse = await server
  .claimableBalances()
  .sponsor(sponsors)
  .asset("QADSAN:GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU")
  .limit(200)
  .call();

  const accumulated: any[] = [];
  let amountRecords = [];
  do { 
    // eslint-disable-next-line no-await-in-loop
    amountRecords = await claimableBalancesStatsResponse;
    amountRecords.records.forEach((item: any) => {
      accumulated.push(item);
    });
    
    claimableBalancesStatsResponse = amountRecords.next();
    
  } while(amountRecords.records.length > 0);

  return (accumulated || []).map(
    (cb: ClaimableBalanceStatsRecord) => {
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
