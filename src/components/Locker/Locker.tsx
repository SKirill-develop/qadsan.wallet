import { Layout, Input, RadioButton, Button } from "@stellar/design-system";
import { useRedux } from "hooks/useRedux";
import styles from "./Locker.module.scss";

export const Locker = () => {
  const { account } = useRedux("account");
  const wallet = account.data ? account.data.id : '';
  console.log(wallet);
return (
  <Layout.Inset> 
    <div className={styles.input}>
      <Input
        id="input-5"
        label="Enter Amount"
        placeholder="Amount"
        rightElement="QADSANS"
      />
    </div>
    <div className={styles.radio}>
      <RadioButton
        id="radio-1-1"
        label="2 weeks"
        name="radio-1"
      />
      <RadioButton
        id="radio-1-2"
        label="1 month"
        name="radio-1"
      />
      <RadioButton
        id="radio-1-3"
        label="3 months"
        name="radio-1"
      />
      <RadioButton
        id="radio-1-4"
        label="6 months"
        name="radio-1"
      />
    </div>
    <div className={styles.button}>
      <Button>
        Lock QADSAN
      </Button>
    </div>
  </Layout.Inset>
  );
};