import StellarSdk from "stellar-sdk";
import { IPriceResponse } from "types/types";

const server = new StellarSdk.Server("https://horizon.stellar.org");

export const getPriceTokens = async (
  Asset: string[],
): Promise<IPriceResponse> => {
  const getPriceResponse = await server
    .trades()
    .forAssetPair(
      new StellarSdk.Asset(Asset[0], Asset[1]),
      // eslint-disable-next-line new-cap
      new StellarSdk.Asset.native(),
    )
    .limit(1)
    .order("desc")
    .call();
  return getPriceResponse.records[0].price;
};

export const getPriceTokensForQADSANNow = async (
  name: string,
  issuer: string,
): Promise<IPriceResponse> => {
  const getPriceResponse = await server
    .trades()
    .forAssetPair(
      new StellarSdk.Asset(name, issuer),
      new StellarSdk.Asset(
        "QADSAN",
        "GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU",
      ),
    )
    .limit(1)
    .order("desc")
    .call();
  return getPriceResponse.records[0].price;
};

export const getPriceTokensForQADSAN = async (
  name: string,
  issuer: string,
): Promise<any> => {
  const date = new Date().getTime();
  const startTime = date - 604800000;
  const endTime = 0;
  const resolution = 86400000;
  const offset = 0;
  const base = new StellarSdk.Asset(name, issuer);
  const counter = new StellarSdk.Asset(
    "QADSAN",
    "GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU",
  );
  const getPriceResponse = await server
    .tradeAggregation(base, counter, startTime, endTime, resolution, offset)
    .limit(7)
    .order("desc")
    .call();
  return getPriceResponse;
};
