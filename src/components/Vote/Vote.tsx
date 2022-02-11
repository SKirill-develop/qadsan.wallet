import { Layout, Input, RadioButton } from "@stellar/design-system";
import styles from "./Vote.module.css";

export const Vote = () => (
  <Layout.Inset> 
    <Input
      defaultValue="Value"
      id="input-5"
      label="Enter Amount"
      placeholder="Amount"
    />
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
  </Layout.Inset>
  );
