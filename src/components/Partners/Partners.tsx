import { useEffect, useState } from 'react';
import { useRedux } from "hooks/useRedux";
import { getUserPartners } from 'utils/getUserInfo';
import moment from "moment";
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Layout,
  Heading5,
  Heading6,
  CopyText,
  Icon,
  Table,
  Identicon,
  TextLink,
} from "@stellar/design-system";
import { knownTokens } from "../../utils/knownTokens";
import style from "./Partners.module.css";


export const Partners = () => {
  const { account } = useRedux("account");
  const [amountPartners, setAmountPartners] = useState();
  const [listPartners, setListPartners] = useState<any>([]);
  const [partnerBalances, setPartnerBalances] = useState<any>([]);

  useEffect(()=>{
    if(account?.data?.id){
      getUserPartners(account.data.id, 'getRefferals')
      .then(res => {
        setListPartners(res);
        setAmountPartners(res.length);
      });
      getUserPartners(account.data.id, 'getPartnerBalances')
      .then(res => {
        setPartnerBalances(res);
      });
    }
  },[]);

  const checkAssetInfo = (asset: string) => {
    const check = knownTokens.find((item) => item.name === asset);
    return check?.iconLink;
  };

  return (
    <Layout.Inset>

      <Heading6>
        By trading QADSAN token-shares,
        you automatically receive a reward for each
        buy-sell transaction (swap) of 0.5% of the transaction amount.*
        </Heading6>
      <Heading6>
        The reward is accrued in token-shares
        of virtual companies that you trade.
        </Heading6>
      <Heading6>
        Senior partners, also receive an affiliate reward (Partner Swap Reward)
        of 20% of their junior partners' trades.
        </Heading6>
      <Heading6>
        Share your QADSAN Wallet affiliate link on social
        networks and invite more partners to earn a steady income.
        </Heading6>
      <Heading6>
        No matter whether the price of token-shares falls or
        rises - you get a commission as a broker.
        The higher the amount of trades and
        their number, the higher your Profit!
        </Heading6>
      <Heading6>
        *The amount of reward can
        both increase and decrease depending on the trading activity.
        </Heading6>
      <Heading6>
        Senior partners, also receive an
        affiliate reward equal to 20% of their junior partners' rewards.
      </Heading6>
      <div className={style.partners__info}>
        <div>
        <Heading5>
          Your affiliate link:
        </Heading5>
        <div>
          <div className={style.partners__link}>
            <div className={style.icon__copy}>
              <CopyText
                showTooltip
                textToCopy={`https://qadsan.app?partner=${account.data?.id}`}
              >
                <Icon.Copy />
              </CopyText>
            </div>
            https://qadsan.app?partner={account.data?.id}
          </div>
        </div>
        </div>
      </div>
      <div className={style.partners__info}>
        </div>
        <div className={style.partners__info}>
        <Heading6>
          Number of partners: {amountPartners}
        </Heading6>
        </div>
        {partnerBalances.length > 0 &&
        <>
        <Heading6>
        Partner balance:
      </Heading6>
      <Table
            breakpoint={300}
            columnLabels={[
              { id: "item-wallet", label: "Token-shares" },
              { id: "item-time", label: "Amount" },
            ]}
            data={partnerBalances}
            pageSize={20}
            renderItemRow={(item) => (
              <>
                <td className={style.partners__table__rowTokens}>
                <img
                  className={style.partners__icon}
                  src={checkAssetInfo(item.token)}
                  alt={item.token}
                />
                {item.token}
                </td>
                <td className={style.partners__table__rowAmount}>
                {item.amount}
                </td>
                <td className={style.partners__table__rowButton}>
                <LoadingButton disabled>
                  Withdrawal
                </LoadingButton>
                </td>
                </>
            )}
            hideNumberColumn
      />
      </>
      }
      {listPartners.length > 0 &&
      <Table
            breakpoint={900}
            columnLabels={[
              { id: "item-wallet", label: "List of partners" },
              { id: "item-time", label: "Date" },
            ]}
            data={listPartners}
            pageSize={20}
            renderItemRow={(item) => (
              <>
                <td>
                  <TextLink
                    href={`https://stellar.expert/explorer/public/account/${item.wallet}`}
                  >
                    <Identicon publicAddress={item.wallet} />
                  </TextLink>
                </td>
                <td>
                {moment(item.timestam).utc().format('MM/DD/YYYY')}
                </td>
                </>
            )}
            hideNumberColumn
      />
      }
    </Layout.Inset>
  );
};
