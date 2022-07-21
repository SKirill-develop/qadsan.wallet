import { Input, Layout } from "@stellar/design-system";
import Button from '@mui/material/Button';

export const Loans = () => {
  return (
    <Layout.Inset>
      <Input
        id="input"
        label="Wallet"
        placeholder="Your wallet"
      />
      <Button variant="contained" disabled>Send</Button>
    </Layout.Inset>
  );
};
