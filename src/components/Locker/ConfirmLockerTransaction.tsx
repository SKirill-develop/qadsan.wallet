import { useRedux } from "hooks/useRedux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendTxAction } from "ducks/sendTx";
import { ActionStatus, AuthType, LockBalanceData } from "types/types.d";
import {
  Button,
  InfoBlock,
  Modal,
  Icon,
} from "@stellar/design-system";
import { LabelAndValue } from "../LabelAndValue";


interface ConfirmLolckTransactionProps {
  formData: LockBalanceData;
  maxFee: string;
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
  onBack: () => void;
}

export const ConfirmLockerTransaction = ({
  formData,
  maxFee,
  onSuccessfulTx,
  onFailedTx,
  onBack,
}: ConfirmLolckTransactionProps) => {

  const { sendTx, settings } = useRedux("sendTx", "keyStore", "settings");
  const { status, errorString } = sendTx;
  const dispatch = useDispatch();

  const getInstructionsMessage = (type: AuthType) => {
    switch (type) {
      case AuthType.ALBEDO:
        return "Review the transaction on the Albedo popup.";
      case AuthType.LEDGER:
        return "Review the transaction on your Ledger wallet device.";
      case AuthType.FREIGHTER:
        return "Review the transaction on the Freighter popup.";
      case AuthType.TREZOR:
        return "Follow the instructions on the Trezor popup.";
      default:
        return "Follow the instructions in the popup.";
    }
  };

  const handleSend = () => {
    dispatch(sendTxAction(formData.tx));
  };

  useEffect(() => {
    if (status === ActionStatus.SUCCESS) {
      onSuccessfulTx();
    }

    if (status === ActionStatus.ERROR) {
      onFailedTx();
    }
  }, [status, onSuccessfulTx, onFailedTx, errorString]);

  return (
    <>
      <Modal.Heading>Confirm transaction</Modal.Heading>

      <Modal.Body>
        <LabelAndValue label="Send QADSAN to">
          GD4TAQ3V6KKWA6HGLGL7G7B7PYQI7YCEZMVGNLJ7IN4BSM65BHIVHLSX
        </LabelAndValue>

        <LabelAndValue label="Fee">{maxFee} lumens</LabelAndValue>

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