import { useState } from "react";
import { Layout, Heading5, Loader } from "@stellar/design-system";
import { useRedux } from "../../hooks/useRedux";
import { BuyTokens } from "../../components/BuyTokens/BuyTokens";
import { SellTokens } from "../../components/SellTokens/SellTokens";
import styles from "./BuySellPage.module.css";

export const BuySellPage = () => {
  const { prices } = useRedux("prices");
  const [show, setShow] = useState("Buy");

  return (
    <>
      <Layout.Inset>
        <Heading5>Price QADSAN:</Heading5>
        <Heading5>
          <div className={styles.price}>
            ${" "}
            {prices.status === "SUCCESS" ? (
              prices.QADSAN.price
            ) : (
              <Loader size="1.5rem" />
            )}
          </div>
        </Heading5>
      </Layout.Inset>
      <Layout.Inset>
        <div className={styles.wallet_info}>
          <nav className={styles.wallet_menu}>
            <Heading5
              className={`${styles.wallet_menu_item} ${
                show === "Buy" ? styles.active : ""
              }`}
              onClick={() => setShow("Buy")}
            >
              Buy QADSAN
            </Heading5>
            <Heading5
              className={`${styles.wallet_menu_item} ${
                show === "Sell" ? styles.active : ""
              }`}
              onClick={() => setShow("Sell")}
            >
              Sell QADSAN
            </Heading5>
          </nav>
          <div className="LayoutSection">
            {show === "Buy" && <BuyTokens />}
            {show === "Sell" && <SellTokens />}
          </div>
        </div>
      </Layout.Inset>
    </>
  );
};
