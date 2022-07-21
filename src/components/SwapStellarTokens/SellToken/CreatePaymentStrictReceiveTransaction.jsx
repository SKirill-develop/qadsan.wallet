import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRedux } from "../../../hooks/useRedux";
import { sendTxAction } from "ducks/sendTx";
import { createSwap } from "ducks/swap";
import { Modal, Input, Icon, TextLink } from "@stellar/design-system";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import { LabelAndValue } from "../../LabelAndValue";
import { Asset } from "stellar-sdk";
import { buildPaymentStrictTransaction } from "../Build";
import { ActionStatus } from "types/types.d";

export const CreatePaymentStrictReceiveTransaction = ({
  token,
  tokenName,
  onCancel,
  assetIssuer,
  onSuccessfulTx,
  onFailedTx,
  destMin,
}) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);
  const { account, sendTx, settings } = useRedux(
    "account",
    "sendTx",
    "keyStore",
    "settings",
  );
  const { status, errorString } = sendTx;

  const totalQADSANS = (amount * destMin).toFixed(5);

  let amountTokens = "0";
  if (account?.data?.balances) {
    amountTokens = account?.data?.balances[tokenName].total.toString();
  }

  useEffect(() => {
    if (status === ActionStatus.SUCCESS) {
      onSuccessfulTx();
    }

    if (status === ActionStatus.ERROR) {
      onFailedTx();
    }
  }, [status, onSuccessfulTx, onFailedTx, errorString]);
  const handleBuy = async () => {
    const tx = await buildPaymentStrictTransaction({
      sendAsset: new Asset(token, assetIssuer),
      sendAmount: amount.toString(),
      publicKey: account.data.id,
      destAsset: new Asset(
        "QADSAN",
        "GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU",
      ),
      destMin: totalQADSANS.toString(),
    });
    dispatch(sendTxAction(tx));
    dispatch(createSwap({
      amount: amount.toString(),
      token: {
        code: token, issuer : assetIssuer,
      },
    }));
  };
  return (
    <>
      <Modal.Heading>Sell {token} For QADSAN</Modal.Heading>

      <Modal.Body>
        <LabelAndValue label="Amount">
          <TextLink onClick={() => setAmount(amountTokens)}>Max</TextLink>
          <Input
            rightElement={token}
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </LabelAndValue>

        <LabelAndValue label="Amount">
          <Input
            rightElement="QADSAN"
            type="number"
            placeholder={`≈ ${totalQADSANS}`}
            disabled
          />
        </LabelAndValue>
      </Modal.Body>

      <Modal.Footer>
        <LoadingButton
          variant="contained"
          onClick={handleBuy}
          loading={status === ActionStatus.PENDING}
        >
          Sell {amount} {token} for QADSAN
        </LoadingButton>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
};
