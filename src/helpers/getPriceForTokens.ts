import StellarSdk from "stellar-sdk";
import { IPriceResponse } from "types/types";

const server = new StellarSdk.Server("https://horizon.stellar.org");

export const getPriceTokens = async (): Promise<IPriceResponse> => {
  const getPriceResponse = await server
    .trades()
    .forAssetPair(
      new StellarSdk.Asset(
        "QADSAN",
        "GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU",
      ),
      // eslint-disable-next-line new-cap
      new StellarSdk.Asset.native(),
    )
    .limit(1)
    .order("desc")
    .call();
  return getPriceResponse.records[0].price;
};
