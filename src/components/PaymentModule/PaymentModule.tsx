import { FC, useState } from "react";
import {
  Button,
  Heading5,
  Modal,
  Card,
  CopyText,
} from "@stellar/design-system";
import { sendNotification } from "../../utils/sendNotification";
import { walletForUSDT } from "../../constants/walletsToPay";

interface IPayProps {
  amountUST: number;
  amountQADSAN: string;
  account: string;
}

export const PaymentModule: FC<IPayProps> = ({
  amountUST,
  amountQADSAN,
  account,
}) => {
  const [thanksInfo, setThanksInfo] = useState(false);

  const handlerIPaidButton = () => {
    sendNotification(account, amountUST, amountQADSAN, "USDT");
    setThanksInfo(true);
  };

  return !thanksInfo ? (
    <div>
      <Modal.Heading>Purchase QADSAN for USDT</Modal.Heading>
      <Modal.Body>
        <Card>
          <Heading5>
            You buy {amountQADSAN} QADSAN for {amountUST} USDT
          </Heading5>
        </Card>

        <Heading5>To pay, transfer</Heading5>

        <Card>
          <Heading5>
            <CopyText
              showCopyIcon
              showTooltip
              textToCopy={amountUST.toString()}
            >
              <div>{amountUST} USDT</div>
            </CopyText>
          </Heading5>
        </Card>

        <Heading5>On wallet (TRC-20) Tron</Heading5>

        <Card>
          <Heading5>
            <CopyText
              showCopyIcon
              showTooltip
              textToCopy={amountUST.toString()}
            >
              {walletForUSDT}
            </CopyText>
          </Heading5>
        </Card>
      </Modal.Body>

      <Modal.Footer>
        <Heading5>After the transfer, click I paid</Heading5>
        <Button onClick={handlerIPaidButton}>I paid</Button>
      </Modal.Footer>
    </div>
  ) : (
    <div>
      <Modal.Heading>Thanks</Modal.Heading>
      <Modal.Body>Expect funds to be credited to your wallet</Modal.Body>
      <Modal.Footer>*The transfer delay can be up to 24 hours</Modal.Footer>
    </div>
  );
};
