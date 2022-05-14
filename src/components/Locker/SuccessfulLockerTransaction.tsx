import { Button, TextLink, Modal } from "@stellar/design-system";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";

export const SuccessfulLockerTransaction = ({
  onCancel,
}: {
  onCancel: () => void;
}) => {
  const { sendTx, settings } = useRedux("sendTx", "settings");

  if (!sendTx.data) {
    return null;
  }

  return (
    <>
      <Modal.Heading>Transaction successfully completed</Modal.Heading>

      <Modal.Body>
        <p className="align--center">
          <TextLink
            href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl}${
              sendTx.data.id
            }`}
          >
            See details on StellarExpert
          </TextLink>
        </p>
        <p>
          You can see the locked amount in your wallet in the PENDING PAYMENTS
          tab.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onCancel} variant={Button.variant.secondary}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};
