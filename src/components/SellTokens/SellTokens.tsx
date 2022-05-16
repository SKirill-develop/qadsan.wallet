import { Heading5, Button, Input, Layout } from "@stellar/design-system";
import { useState } from "react";
import styles from "pages/BuySellPage/BuySellPage.module.css";
import { useRedux } from "../../hooks/useRedux";

export const SellTokens = () => {
  const [amount, setAmount] = useState("");
  const { prices } = useRedux("prices");

  const totalInDollSumma = () => {
    const summa = Number(amount) * prices.QADSAN.price;
    const fee = (summa / 100) * 5;
    return summa - fee;
  };

  return (
    <>
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
          <Button disabled>Sell QADSAN for USDT</Button>
        </div>
        <p>* The transfer delay can be up to 24 hours</p>
      </Layout.Inset>
    </>
  );
};
