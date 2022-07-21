import { FC, useState } from "react";
import {
  Button,
  Heading5,
  Modal,
  Card,
  CopyText,
  Icon,
} from "@stellar/design-system";
import { sendNotification } from "../../utils/sendNotification";
import styles from './PaymentModule.module.css';
import QR from '../../assets/QR_BINANCE.png';

interface IPayProps {
  amountUST: string;
  amountQADSAN: string;
  account: string;
  walletForPay: string;
  currency: string;
  isBinance: boolean;
}

export const PaymentModule: FC<IPayProps> = ({
  amountUST,
  amountQADSAN,
  account,
  walletForPay,
  currency,
  isBinance,
}) => {
  const [thanksInfo, setThanksInfo] = useState(false);

  const handlerIPaidButton = () => {
    sendNotification(
      "Buy",
      account,
      amountUST,
      amountQADSAN,
      currency,
      account,
    );

    setThanksInfo(true);
  };

  return !thanksInfo ? (
    <div>
      <Modal.Heading>Purchase QADSAN for {currency}</Modal.Heading>
      <Modal.Body>
        <Card>
          <Heading5>
            You buy {amountQADSAN} QADSAN for {amountUST} {currency}
          </Heading5>
        </Card>

        <Heading5>To pay, transfer</Heading5>

        <Card>
          <Heading5>
            <CopyText
              showTooltip
              textToCopy={amountUST.toString()}
            >
              <div className={styles.copy_content}>
                {amountUST} {currency}
                <div className={styles.copy}>
                  <Icon.Copy />
                </div>
              </div>
            </CopyText>
          </Heading5>
        </Card>
        {isBinance ?
        <div className={styles.img__contain}>
          <img className={styles.img__QR} src={QR} alt="QR" />
        </div>
        : ''}
        <Heading5>On {isBinance ? 'Pay ID' : 'wallet'}</Heading5>

        <Card>
          <Heading5>
            <CopyText showTooltip textToCopy={walletForPay}>
              <div className={styles.copy_content}>
                {walletForPay}
                <div className={styles.copy}>
                  <Icon.Copy />
                </div>
              </div>
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
