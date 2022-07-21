import StellarSdk, { Asset } from "stellar-sdk";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";


export const buildPaymentStrictTransaction = async (
  params,
) => {
  let transaction;
  try {
    const {
      sendAsset,
      sendAmount,
      publicKey,
      destAsset,
      destMin,
    } = params;

    const { settings } = store.getState();
    const server = new StellarSdk.Server(
      getNetworkConfig(settings.isTestnet).url,
    );
    const sequence = (await server.loadAccount(publicKey)).sequence;
    const source = await new StellarSdk.Account(publicKey, sequence);

    const optionalFee = await server.feeStats();
    const avgFee = optionalFee.max_fee.p30;
    const fee = (avgFee * 1.1).toFixed(0);

    transaction = new StellarSdk.TransactionBuilder(source, {
      fee,
      networkPassphrase: getNetworkConfig(settings.isTestnet).network,
      timebounds: await server.fetchTimebounds(100),
      memo: StellarSdk.Memo.text("QADSAN SWAP"),
    });

    const BuyAssetOperation = StellarSdk.Operation.pathPaymentStrictSend({
      sendAsset,
      sendAmount,
      destination : publicKey,
      destAsset,
      destMin,
    });

    transaction.addOperation(BuyAssetOperation);

    transaction = transaction.build();
  } catch (error) {
    throw new Error(
      `Failed to build transaction, error: ${getErrorString(error)})}`,
    );
  }
  return transaction;
};