import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import { getInstructionsMessage } from "utils/getInstructionsMessage";
import {
  Button,
  InfoBlock,
  TextLink,
  Modal,
  Icon,
  Identicon,
} from "@stellar/design-system";

import { LabelAndValue } from "components/LabelAndValue";

import { getMemoTypeText } from "helpers/getMemoTypeText";
import { sendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, PaymentFormData } from "types/types.d";

import { AccountIsUnsafe } from "./WarningMessages/AccountIsUnsafe";

interface ConfirmTransactionProps {
  formData: PaymentFormData;
  maxFee: string;
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
  onBack: () => void;
}

export const ConfirmTransaction = ({
  formData,
  maxFee,
  onSuccessfulTx,
  onFailedTx,
  onBack,
}: ConfirmTransactionProps) => {
  const { sendTx, settings } = useRedux("sendTx", "keyStore", "settings");
  const { status, errorString } = sendTx;
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === ActionStatus.SUCCESS) {
      onSuccessfulTx();
    }

    if (status === ActionStatus.ERROR) {
      onFailedTx();
    }
  }, [status, onSuccessfulTx, onFailedTx, errorString]);

  const handleSend = () => {
    dispatch(sendTxAction(formData.tx));
  };

  return (
    <>
      <Modal.Heading>Confirm transaction</Modal.Heading>

      <Modal.Body>
        <LabelAndValue label="Sending to address">
          <Identicon publicAddress={formData.toAccountId} />
        </LabelAndValue>

        {formData.isAccountUnsafe && <AccountIsUnsafe />}

        <LabelAndValue label="Amount">
          {formData.amount}{" "}
          {new BigNumber(formData.amount).eq(1) ? "token" : "tokens"}
        </LabelAndValue>

        {formData.memoContent ? (
          <LabelAndValue label="Memo">
            {formData.memoContent} ({getMemoTypeText(formData.memoType)})
          </LabelAndValue>
        ) : null}

        <LabelAndValue label="Fee">{maxFee} lumens</LabelAndValue>

        {!formData.isAccountFunded && (
          <InfoBlock>
            The destination account doesn’t exist. A create account operation
            will be used to create this account.{" "}
            <TextLink href="https://developers.stellar.org/docs/tutorials/create-account/">
              Learn more about account creation
            </TextLink>
          </InfoBlock>
        )}

        {status === ActionStatus.PENDING &&
          settings.authType &&
          settings.authType !== AuthType.PRIVATE_KEY && (
            <InfoBlock>{getInstructionsMessage(settings.authType)}</InfoBlock>
          )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleSend}
          iconLeft={<Icon.Send />}
          isLoading={status === ActionStatus.PENDING}
        >
          Submit transaction
        </Button>
        <Button
          onClick={onBack}
          variant={Button.variant.secondary}
          disabled={status === ActionStatus.PENDING}
        >
          Back
        </Button>
      </Modal.Footer>

      {status === ActionStatus.PENDING && (
        <p className="Paragraph--secondary align--right">
          Submitting transaction
        </p>
      )}
    </>
  );
};
