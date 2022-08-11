import { Layout } from "@stellar/design-system";
import { Balances } from 'components/Binance/Balances/Balances';

export const BinanceDashboard = () => {

  return (
    <Layout.Inset>
      <Balances />
    </Layout.Inset>
  );
};
