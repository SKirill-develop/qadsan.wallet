import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BalanceInfo } from "components/BalanceInfo";
import { ClaimableBalances } from "components/ClaimableBalances/ClaimableBalances";
import { TransactionHistory } from "components/TransactionHistory";
import { Locker } from "components/Locker/Locker";
import { Partners } from "components/Partners/Partners";
import { Rewards } from "components/Rewards/Rewards";
import { Loans } from "components/Loans/Loans";
import { fetchFlaggedAccountsAction } from "ducks/flaggedAccounts";
import { fetchMemoRequiredAccountsAction } from "ducks/memoRequiredAccounts";
import { Layout, Heading5 } from "@stellar/design-system";
import { LiquidityPoolTransactions } from "components/LiquidityPoolTransactions";
import { AppDispatch } from "config/store";
import { useRedux } from "hooks/useRedux";
import { savePublicKey } from "utils/register";
import { getUserInfo } from "utils/getUserInfo";
import { addUserInfoAction } from "ducks/account";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  const [show, setShow] = useState("Locker");
  const dispatch: AppDispatch = useDispatch();
  const { account } = useRedux("account");

  useEffect(() => {
    dispatch(fetchFlaggedAccountsAction());
    dispatch(fetchMemoRequiredAccountsAction());
  }, [dispatch]);

  useEffect(() => {
    if(account?.data?.id){
      savePublicKey(account.data.id, account.partner);
      getUserInfo(account.data.id)
        .then((res) => {
          dispatch(addUserInfoAction({
            userId: res[0].id,
            balance: res[0].balance,
            partner: res[0].senior_id,
          }));
        });
    }

  }, [dispatch]);

  return (
    <Layout.Inset>
      <div className={styles.wallet_info}>
        <BalanceInfo />
        <nav className={styles.wallet_menu}>
          <Heading5
            className={`${styles.wallet_menu_item} ${show === "Locker" ? styles.active : ""
              }`}
            onClick={() => setShow("Locker")}
          >
            Locker
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${show === "Rewards" ? styles.active : ""
              }`}
            onClick={() => setShow("Rewards")}
          >
            Rewards
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${show === "Loans" ? styles.active : ""
              }`}
            onClick={() => setShow("Loans")}
          >
            Loans
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${show === "Creamble" ? styles.active : ""
              }`}
            onClick={() => setShow("Creamble")}
          >
            Pending payments
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${show === "Transactions" ? styles.active : ""
              }`}
            onClick={() => setShow("Transactions")}
          >
            Transactions
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${show === "LiquidityPool" ? styles.active : ""
              }`}
            onClick={() => setShow("LiquidityPool")}
          >
            Liquidity Pool
          </Heading5>
          <Heading5
            className={`${styles.wallet_menu_item} ${show === "Partners" ? styles.active : ""
              }`}
            onClick={() => setShow("Partners")}
          >
            AFFILIATES
          </Heading5>
        </nav>
        <div className="LayoutSection">
          {show === "Locker" && <Locker />}
          {show === "Rewards" && <Rewards />}
          {show === "Loans" && <Loans />}
          {show === "Creamble" && <ClaimableBalances />}
          {show === "Transactions" && <TransactionHistory />}
          {show === "LiquidityPool" && <LiquidityPoolTransactions />}
          {show === "Partners" && <Partners />}
        </div>
      </div>
    </Layout.Inset>
  );
};
