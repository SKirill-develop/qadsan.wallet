import { useEffect, useState } from 'react';
import { useRedux } from "hooks/useRedux";
import { getUserPartners } from 'utils/getUserInfo';
import moment from "moment";
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

  return (
    <Layout.Inset>
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
                <td>
                {item.token}
                </td>
                <td>
                {item.amount}
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
