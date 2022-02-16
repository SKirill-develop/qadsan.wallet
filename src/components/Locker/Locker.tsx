import { useState } from "react";
import { useDispatch } from "react-redux";
import { Layout, Button, Modal, Heading5, Select } from "@stellar/design-system";
import { resetSendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { LockerFlow } from './LockerFlow';

import styles from "./Locker.module.scss";

export const Locker = () => {

  const dispatch = useDispatch();
  const { account } = useRedux("account");
  const [isLockModalVisible, setIsModalVisible] = useState(false);
  const [memo, setMemo] = useState<string>('2 weeks');

  let amountQadsan;
if(account?.data?.balances){
  amountQadsan = account.data.balances['QADSAN:GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU'].total.toString();
}

  const handleShow = () => {
    setIsModalVisible(true);
  };

  const resetModalStates = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout.Inset>
      { amountQadsan === undefined || amountQadsan === '0'
        ?
        <>
          <div>
            <Heading5>You don't have QADSAN</Heading5>
          </div>
          <Heading5>To lock you need to deposit QADSAN tokens</Heading5>
        </>
        :
        <>
          <div className={styles.input}>
            <Heading5>You have : {amountQadsan} QADSAN</Heading5>
          </div>
          <div className={styles.radio}>
            <Select
              id='Period'
              label="Lock period"
              onChange={(e) => {
                setMemo(e.target.value);
              }}
              value={memo}
            >
              <option value='2 weeks'>2 weeks: 1.5% per week (216.90% APY)</option>
              <option value='1 month'>1 month: 1.75% per week (246.48% APY)</option>
              <option value='3 months'>3 months: 2.00% per week (280.01% APY)</option>
              <option value='6 months'>6 months: 2.50% per week (361.08% APY)</option>
            </Select>
          </div>
          <div className={styles.button}>
            <Button onClick={handleShow}>
              Lock QADSAN
            </Button>
          </div>
        </>
      }

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