import StellarSdk from "stellar-sdk";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";
import { knownTokens } from "../utils/knownTokens";

export const OpenTrustsLinesForQadsanAssets = async (
  publicAddress: string | undefined,
  ) => {
  let transaction: any;
  try {
    const { settings } = store.getState();
    const server = new StellarSdk.Server(
      getNetworkConfig(settings.isTestnet).url,
    );
    const sequence = (await server.loadAccount(publicAddress)).sequence;
    const source = await new StellarSdk.Account(publicAddress, sequence);

    const optionalFee = await server.feeStats();
    const avgFee = optionalFee.max_fee.p50;
    const fee = (avgFee * 1.1).toFixed(0);
    transaction = new StellarSdk.TransactionBuilder(source, {
      fee,
      networkPassphrase: getNetworkConfig(settings.isTestnet).network,
      timebounds: await server.fetchTimebounds(100),
    });

    knownTokens.forEach((item) => {
      if(item.type === "QADSAN" || item.type === "QADSAN Token"){
        const asset = new StellarSdk.Asset(
          item.name,
          item.issuer,
        );
      transaction.addOperation(StellarSdk.Operation.changeTrust({
        asset,
      }));
    }
    });

    transaction = transaction.build();
  } catch (error) {
    throw new Error(
      `Failed to build transaction, error: ${getErrorString(error)})}`,
    );
  }
  return transaction;
};
