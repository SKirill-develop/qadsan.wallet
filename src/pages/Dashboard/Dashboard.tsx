import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BalanceInfo } from "components/BalanceInfo";
import { ClaimableBalances } from "components/ClaimableBalances/ClaimableBalances";
import { TransactionHistory } from "components/TransactionHistory";
import { Locker } from "components/Locker/Locker";
import { fetchFlaggedAccountsAction } from "ducks/flaggedAccounts";
import { fetchMemoRequiredAccountsAction } from "ducks/memoRequiredAccounts";
import { Layout, Heading5 } from "@stellar/design-system";
import { LiquidityPoolTransactions } from "../../components/LiquidityPoolTransactions";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  const [show, setShow] = useState("Voting");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFlaggedAccountsAction());
    dispatch(fetchMemoRequiredAccountsAction());
  }, [dispatch]);

  return (
    <Layout.Inset>
      <div className={styles.wallet_info}>
        <BalanceInfo />
        <nav className={styles.wallet_menu}>
          <Heading5
            className={`${styles.wallet_menu_item} ${
              show === "Voting" ? styles.active : ""
            }`}
            onClick={() => setShow("Voting")}
          >
            Locker
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${
              show === "Creamble" ? styles.active : ""
            }`}
            onClick={() => setShow("Creamble")}
          >
            Pending payments
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${
              show === "Transactions" ? styles.active : ""
            }`}
            onClick={() => setShow("Transactions")}
          >
            Transactions
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${
              show === "LiquidityPool" ? styles.active : ""
            }`}
            onClick={() => setShow("LiquidityPool")}
          >
            Liquidity Pool
          </Heading5>
        </nav>
        <div className="LayoutSection">
          {show === "Voting" && <Locker />}
          {show === "Creamble" && <ClaimableBalances />}
          {show === "Transactions" && <TransactionHistory />}
          {show === "LiquidityPool" && <LiquidityPoolTransactions />}
        </div>
      </div>
    </Layout.Inset>
  );
};
