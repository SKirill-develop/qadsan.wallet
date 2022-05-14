import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Layout,
  Button,
  Modal,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Select,
} from "@stellar/design-system";
import { resetSendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { LockerFlow } from "./LockerFlow";
import { QADSAN_ASSET } from "../../constants/settings";
import { getLockerStats } from "../../ducks/LockerStats";

import styles from "./Locker.module.scss";

export const Locker = () => {
  const dispatch = useDispatch();
  const { account } = useRedux("account");
  const { claimableBalancesStats } = useRedux("claimableBalancesStats");
  const [isLockModalVisible, setIsModalVisible] = useState(false);
  const [memo, setMemo] = useState("2 weeks");
  const [totalLocked, setTotalLocked] = useState(0);
  const { data } = claimableBalancesStats;

  let amountQadsan;
  if (account?.data?.balances) {
    amountQadsan = account?.data?.balances[QADSAN_ASSET]?.total.toString();
  }
  const amountNumber = Number(amountQadsan);

  useMemo(() => {
    const total: number[] = [];
    data.data?.forEach((element: any | undefined) => {
      total.push(Number(element.amount));
    });
    const totalLockedSumm = total.reduce(
      (sum: number, amount: number) => sum + amount,
      0,
    );
    setTotalLocked(totalLockedSumm);
  }, [data.data]);

  const handleShow = () => {
    setIsModalVisible(true);
  };

  const resetModalStates = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    dispatch(
      getLockerStats(
        "GD4TAQ3V6KKWA6HGLGL7G7B7PYQI7YCEZMVGNLJ7IN4BSM65BHIVHLSX",
      ),
    );
  }, [dispatch, isLockModalVisible]);

  return (
    <Layout.Inset>
      {amountQadsan === undefined || amountQadsan === "0" ? (
        <>
          <div>
            <Heading5>You don't have QADSAN</Heading5>
          </div>
          <Heading5>To lock you need to deposit QADSAN tokens</Heading5>
        </>
      ) : (
        <>
          <div className={styles.input}>
            <Heading5>
              You have : {amountNumber.toLocaleString("en-GB")} QADSAN
            </Heading5>
          </div>
          <div className={styles.radio}>
            <Select
              id="Period"
              label="Lock period"
              onChange={(e) => {
                setMemo(e.target.value);
              }}
              value={memo}
            >
              <option value="2 weeks">
                2 weeks: 1.25 - 12.5% per week ( 216.9 – 45,702.34% APY )
              </option>
              <option value="1 month">
                1 month: 1.75 - 17.5% per week ( 246.48 – 438,481.34% APY )
              </option>
              <option value="3 months">
                3 months: 2.00 - 20% per week ( 280.01 – 1,310,475.08% APY )
              </option>
              <option value="6 months">
                6 months: 2.50 – 25% per week ( 361.08 - 10,947,940.05% APY )
              </option>
            </Select>
          </div>
          <div className={styles.button}>
            <Button onClick={handleShow}>Lock QADSAN</Button>
          </div>
        </>
      )}
      <Layout.Inset>
        <Heading3>Why lock QADSAN?</Heading3>
        <Heading6>
          Those who lock QADSAN will be eligible for additional benefits while
          using QADSAN market game.
        </Heading6>
        <Heading6>
          Two of these benefits are guaranteed weekly dividends in QADSAN tokens
          and 10 token-shares, as well as the ability to manage the project by
          voting.
        </Heading6>
        <Heading6>
          In addition, you can receive loans with any token-shares up to 50% of
          the locked QADSAN tokens.
        </Heading6>
        <Heading6>More information will be released soon...</Heading6>
        <Heading4 className={styles.stats__total}>
          Total locked: <b>{totalLocked.toLocaleString("en-GB")}</b> QADSAN
        </Heading4>
      </Layout.Inset>

      <Modal visible={isLockModalVisible} onClose={resetModalStates}>
        {isLockModalVisible && (
          <LockerFlow
            onCancel={() => {
              setIsModalVisible(true);
              resetModalStates();
            }}
            onSuccess={() => {
              dispatch(resetSendTxAction());
              setIsModalVisible(true);
              resetModalStates();
            }}
            memo={memo}
          />
        )}
      </Modal>
    </Layout.Inset>
  );
};
