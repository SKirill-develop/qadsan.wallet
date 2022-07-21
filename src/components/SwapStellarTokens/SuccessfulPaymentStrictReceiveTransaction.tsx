import { useEffect } from 'react';
import { TextLink, Modal } from "@stellar/design-system";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { sendRewardForSwap, sendRewardForSwapPartner } from "utils/sendRewardForSwap";
import Button from '@mui/material/Button';

export const SuccessfulPaymentStrictReceiveTransaction = ({
  onCancel,
}: {
  onCancel: () => void;
}) => {
  const { sendTx, settings, swap, account } =
    useRedux("sendTx", "settings", "swap", "account");

  useEffect(()=> {
    if(account.data?.id){
    if (sendTx.data?.memo === "QADSAN SWAP" && sendTx.status === "SUCCESS") {

      sendRewardForSwap(
        account.data.id,
        swap.amount,
        swap.token.code,
        swap.token.issuer,
        ).then(res => console.log(res));

  if(account.partner){
    sendRewardForSwapPartner(
      account.partner,
      swap.amount,
      swap.token.code,
      swap.token.issuer,
      ).then(res => console.log(res));
  }

    }
  }
  },[sendTx]);

  if (!sendTx.data) {
    return null;
  }

  return (
    <>
      <Modal.Heading>Transaction successfully completed</Modal.Heading>

      <Modal.Body>
        <p className="align--center">
          <TextLink
            href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl}${sendTx.data.id
              }`}
          >
            See details on StellarExpert
          </TextLink>
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onCancel} variant="contained">
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};
