import { Modal } from "@stellar/design-system";
import Button from '@mui/material/Button';
import { ErrorMessage } from "components/ErrorMessage";
import { useRedux } from "hooks/useRedux";
import { AuthType } from "types/types.d";

export const FailedPaymentStrictReceiveTransaction = ({
  onCancel,
}: {
  onCancel: () => void;
}) => {
  const { sendTx, settings } = useRedux("sendTx", "settings");

  return (
    <>
      <Modal.Heading>Transaction failed</Modal.Heading>

      <Modal.Body>
        <p>See details below for more information.</p>
        <ErrorMessage message={`Error: ${sendTx.errorString}`} />
        {settings.authType === AuthType.PRIVATE_KEY ? (
          <ErrorMessage
            message="The attempted operation may not be supported on this wallet yet."
            fontSize="var(--font-size-secondary)"
          />
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onCancel} variant="contained">
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};
