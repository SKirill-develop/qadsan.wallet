import { useState } from "react";
import { Keypair } from "stellar-sdk";
import {
  Button,
  Checkbox,
  Heading4,
  InfoBlock,
  TextLink,
  Modal,
  CopyText,
} from "@stellar/design-system";

import { ErrorMessage } from "components/ErrorMessage";
import { KeyPairWithLabels } from "components/KeyPairWithLabels";

import { useErrorMessage } from "hooks/useErrorMessage";
import { ModalPageProps } from "types/types.d";

interface KeyPairType {
  publicKey: string;
  secretKey: string;
}

export const NewKeyPairForm = ({ onClose }: ModalPageProps) => {
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [newKeyPair, setNewKeyPair] = useState<KeyPairType | undefined>();
  const [keyPairCopyString, setKeyPairCopyString] = useState("");
  const [confirmSavedSecretKey, setConfirmSavedSecretKey] = useState(false);
  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: "",
  });

  const generateNewKeyPair = () => {
    const keypair = Keypair.random();

    setNewKeyPair({
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    });

    // Spacing here is important for copied string
    setKeyPairCopyString(`Public key:
${keypair.publicKey()}
Secret key:
${keypair.secret()}`);
  };

  const handleContinue = () => {
    setAcceptedWarning(true);
    generateNewKeyPair();
  };

  const handleDone = () => {
    if (!confirmSavedSecretKey) {
      setErrorMessage(
        "Please confirm that you have copied and stored your secret key",
      );
      return;
    }

    handleClose();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    setErrorMessage("");
  };

  const toggleConfirmSavedSecretKey = () => {
    setErrorMessage("");
    setConfirmSavedSecretKey(!confirmSavedSecretKey);
  };

  return (
    <>
      {/* Show warning */}
      {!acceptedWarning && (
        <>
          <Modal.Heading>Generate a new keypair</Modal.Heading>

          <Modal.Body>
            <InfoBlock variant={InfoBlock.variant.error}>
              <Heading4>ATTENTION: Secret key wallets are not safe:</Heading4>

              <ul>
                <li>
                  Pasting your secret key makes you vulnerable to accidents,
                  attacks, and scams that can result in loss of funds.
                </li>
                <li>
                  It is safer to create an account using methods that do not
                  share your secret key with websites, such as hardware wallets
                  or browser extensions.
                </li>
              </ul>
            </InfoBlock>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={handleContinue}>Continue</Button>
            <Button onClick={handleClose} variant={Button.variant.secondary}>
              Cancel
            </Button>
          </Modal.Footer>
        </>
      )}

      {/* Show generate new key pair form */}
      {acceptedWarning && (
        <>
          <Modal.Heading>Generate a new keypair</Modal.Heading>

          <Modal.Body>
            <InfoBlock variant={InfoBlock.variant.error}>
              <Heading4>ATTENTION:</Heading4>

              <ul>
                <li>
                  It is very important to save your secret key and store it
                  somewhere safe.
                </li>
                <li>
                  If you lose it, you will lose access to your account. No one
                  in the known universe will be able to help you get back in.
                </li>
                <li>
                  SDF does not store a copy of your keys and cannot help you
                  recover lost keys.
                </li>
                <li>
                  Anyone who knows your secret key has access to your funds.
                </li>
                <li>
                  You have several options: Write your key down on a piece of
                  paper. Keep it in a safe. Store it in a password manager. Use
                  a hardware wallet. But don't ever keep it unencrypted on your
                  computer or in your email.
                </li>
              </ul>
            </InfoBlock>

            {newKeyPair && (
              <>
                <KeyPairWithLabels
                  publicKey={newKeyPair.publicKey}
                  secretKey={newKeyPair.secretKey}
                />

                <div className="CopyKey-container">
                  <CopyText
                    textToCopy={keyPairCopyString}
                    showCopyIcon
                    showTooltip
                    tooltipPosition={CopyText.tooltipPosition.RIGHT}
                  >
                    <TextLink>Copy keys</TextLink>
                  </CopyText>
                </div>
              </>
            )}

            <ErrorMessage message={errorMessage} marginBottom="1.5rem" />

            <Checkbox
              id="confirmSavedSecretKey"
              label="I’ve stored my secret key in a safe place"
              checked={!!confirmSavedSecretKey}
              onChange={toggleConfirmSavedSecretKey}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={handleDone}>Close</Button>
          </Modal.Footer>
        </>
      )}
    </>
  );
};
