import { Heading5, Button, Input, Layout, Modal } from "@stellar/design-system";
import { SyntheticEvent, useState } from "react";
import styles from "pages/BuySellPage/BuySellPage.module.css";
import { LayoutSection } from "components/LayoutSection";
import { useRedux } from "../../hooks/useRedux";
import { sendNotification } from "../../utils/sendNotification";
import { PaymentModule } from "../PaymentModule/PaymentModule";

export const BuyTokens = () => {
  const [amount, setAmount] = useState("");
  const { prices } = useRedux("prices");
  const { account } = useRedux("account");
  const [isSendTxModalVisible, setIsSendTxModalVisible] = useState(false);
  const [isReceiveTxModalVisible, setIsReceiveTxModalVisible] = useState(false);

  const totalInDollSumma = () => {
    const summa = Number(amount) * prices.QADSAN.price;
    const fee = (summa / 100) * 5;
    return summa - fee;
  };

  const resetModalStates = () => {
    setIsSendTxModalVisible(false);
    setIsReceiveTxModalVisible(false);
  };

  const handlerBuyMetamask = async (event: SyntheticEvent) => {
    event.preventDefault();
    const getPriceEther = () =>
      fetch("https://ethereum-api.xyz/eth-prices")
        .then((response) => response.json())
        .then((response) => response.result.USD)
        .catch((err) => console.error(err));

    const priceEther = await getPriceEther();

    const EthSumma = totalInDollSumma() / Number(priceEther);

    const to = "0xc019ac4384be35123c3ded7f1ba007d7d04db8d7";
    window.open(
      `https://pay.buildship.dev/to/${to}?value=${EthSumma}`,
      "payment",
      "width=500, height=800",
    );
    sendNotification(account.data!.id, EthSumma, amount, "Etherium");
  };

  return (
    <LayoutSection>
      <Layout.Inset>
        <Input
          id="1"
          label="Amount"
          type="number"
          rightElement="QADSAN"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          value={amount}
          placeholder="100000"
        />
        {amount && (
          <>
            <p className="Paragraph--secondary">
              <i>*5% service commission</i>
            </p>
            <Heading5>Total in $: {totalInDollSumma()}</Heading5>
          </>
        )}
        <div className={styles.buy_sell_buttons}>
          <Button onClick={handlerBuyMetamask}>Buy QADSAN for Etherium</Button>
          <Button
            onClick={() => {
              setIsSendTxModalVisible(true);
            }}
          >
            Buy QADSAN for USDT
          </Button>
        </div>
        <p>* The transfer delay can be up to 24 hours</p>
      </Layout.Inset>
      <Modal
        visible={isSendTxModalVisible || isReceiveTxModalVisible}
        onClose={resetModalStates}
      >
        <PaymentModule
          amountUST={totalInDollSumma()}
          amountQADSAN={amount}
          account={account.data!.id}
        />
      </Modal>
    </LayoutSection>
  );
};
