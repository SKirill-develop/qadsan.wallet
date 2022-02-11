import StellarSdk, { Transaction } from "stellar-sdk";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";
import { signTransaction } from "helpers/keyManager";
import { signLedgerTransaction } from "helpers/signLedgerTransaction";
import { signTrezorTransaction } from "helpers/signTrezorTransaction";
import { AuthType } from "types/types.d";

export const submitPaymentTransaction = async (transaction: Transaction) => {
  const { settings, keyStore } = store.getState();
  const server = new StellarSdk.Server(
    getNetworkConfig(settings.isTestnet).url,
  );

  try {
    let signedTransaction: Transaction;
    if (settings.authType === AuthType.LEDGER) {
      signedTransaction = await signLedgerTransaction(transaction, keyStore);
    } else if (settings.authType === AuthType.TREZOR) {
      signedTransaction = await signTrezorTransaction(transaction, keyStore);
    } else {
      signedTransaction = await signTransaction({
        id: keyStore.keyStoreId,
        password: keyStore.password,
        transaction,
        custom: keyStore.custom,
      });
    }

    return await server.submitTransaction(signedTransaction);
  } catch (error) {
    throw new Error(
      `Failed to sign transaction, error: ${getErrorString(error)}`,
    );
  }
};
