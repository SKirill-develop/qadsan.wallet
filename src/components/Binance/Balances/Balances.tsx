import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useWallet } from 'use-wallet';
import moment from "moment";
import convert from 'ethereum-unit-converter';
import { LayoutSection } from "components/LayoutSection";
import { useDispatch } from "react-redux";
import { AppDispatch } from "config/store";
import Button from '@mui/material/Button';
import {
  Heading2,
  Heading3,
  Heading5,
  Card,
  Loader,
  Table,
  TextLink,
  Eyebrow,
} from "@stellar/design-system";
import { getBalancesBinance } from "ducks/binanceAccount";
import { useRedux } from "hooks/useRedux";
import BNBLogo from 'assets/logo/binance-logo.webp';
import style from './Balances.module.css';
import { knownTokens } from 'utils/knownTokens';


export const Balances = () => {
  const wallet = useWallet();
  const dispatch: AppDispatch = useDispatch();
  const { binanceAccount } = useRedux("binanceAccount");
  const { prices } = useRedux("prices");
  const [allPrice, setAllPrice] = useState(prices?.XLM?.price);

  const findQadsanTokensPrice = (token: string) => {
    if (prices.status === 'SUCCESS') {
      const Token = prices.Tokens.find(
        (item: { code: string }) => item.code === token);
      if (Token) {
        return Token.price_now;
      }
    }
    return 0;
  };

  const findTokenAmount = (token: string) => {
    if (binanceAccount.status === 'SUCCESS') {
      const Token = binanceAccount.tokens.find(
        (item: { name: string }) => item.name === token);
      if (Token) {
        return Token.amount;
      }
    }
    return 0;
  };

  const qadsanFilter = knownTokens.filter(
    item => item.type === "QADSAN" || item.typeBinance,
  );

  useEffect(() => {
    if (wallet.account) {
      dispatch(getBalancesBinance(wallet.account));
    }
  }, [wallet]);

  const TokensInDoll = (amount: number, token: string) =>
    Number((amount * findQadsanTokensPrice(token)));

  const totalSummaArray: any = [];
  const AssetInDoll = (amount: number): number => {
    const summa = Number((amount * prices?.QADSAN?.price).toFixed(2));
    totalSummaArray.push(summa);
    return summa;
  };

  const BnbInDoll: number = Number(
    (Number(convert(wallet.balance, 'wei', 'ether'))
      * binanceAccount.bnbPrice).toFixed(2),
  );

  useEffect(() => {
    const totalSummaReducer: number = totalSummaArray.reduce(
      (summa: number, amount: number) => summa + amount, 0);

    const All = totalSummaReducer + BnbInDoll;
    setAllPrice(All);

  }, [totalSummaArray]);

  return (
    <>
      <LayoutSection>
        <Heading3 className={style.total}>
          Your Balance ≈ ${
            binanceAccount.status === 'SUCCESS'
              && prices.status === 'SUCCESS' ?
              allPrice.toFixed(2) :
              <Loader size="2rem" />}
        </Heading3>
        <div className={style.buyButton}>
          <Link to="/binance/buy-sell">
            <Button variant="contained">
              BUY/SELL QADSAN
        </Button>
          </Link>
        </div>

        <Card>
          <div className={style.card}>
            <img className={style.logo} src={BNBLogo} alt="BNB" />
            <Heading3>{convert(wallet.balance, 'wei', 'ether')} BNB</Heading3>
            <Eyebrow>{`≈ $${BnbInDoll}`}</Eyebrow>
          </div>
        </Card>
        <div className={style.balances__list}>

          {qadsanFilter.map((asset) => (
            <Card key={asset.id}>
              <div className={style.card}>
                <img
                  className={style.logo}
                  src={asset.iconLink}
                  alt={asset.name}
                />

                <Heading5>
                  {binanceAccount.status === 'SUCCESS' ?
                    convert(findTokenAmount(asset.name), 'wei', 'ether')
                    :
                    <Loader />
                  }
                </Heading5>
                <Eyebrow>{`≈ $${asset.name === 'QADSAN' ?
                  AssetInDoll(Number(findTokenAmount(asset.name)))
                  : AssetInDoll(
                    TokensInDoll(
                      Number(findTokenAmount(asset.name)),
                      asset.name))
                  }`}
                </Eyebrow>
                <Heading5>{asset.name}</Heading5>
              </div>
            </Card>
          ),
          )}
        </div>
      </LayoutSection>
      {binanceAccount.status === 'SUCCESS' &&
        <LayoutSection>
          <Heading2>Payments History</Heading2>
          <Table
            breakpoint={900}
            columnLabels={[
              { id: "item-tx", label: "Tx" },
              { id: "item-from", label: "From" },
              { id: "item-to", label: "To" },
              { id: "item-amount", label: "Amount" },
              { id: "item-date", label: "Date" },
            ]}
            data={binanceAccount.transactions.result}
            pageSize={20}
            renderItemRow={(item) => (
              <>
                <td>
                  <TextLink
                    href={`https://bscscan.com/tx/${item.hash}`}
                    variant={TextLink.variant.secondary}
                  >
                    {item.hash.slice(0, 10)}...{item.hash.slice(-9)}
                  </TextLink>
                </td>
                <td>
                  <TextLink
                    href={`https://bscscan.com/address/${item.from}`}
                    variant={TextLink.variant.secondary}
                  >
                    {item.from.slice(0, 5)}...{item.from.slice(-4)}

                  </TextLink>
                </td>
                <td>
                  <TextLink
                    href={`https://bscscan.com/address/${item.to}`}
                    variant={TextLink.variant.secondary}
                  >
                    {item.to.slice(0, 5)}...{item.to.slice(-4)}
                  </TextLink>
                </td>
                <td>{convert(item.value, 'wei', 'ether')} {item.tokenSymbol}</td>
                <td>{moment
                  .unix(item.timeStamp)
                  .format("D/MM/YYYY HH:mm")}</td>
              </>
            )}
            emptyMessage="There are no transactions to show"
            hideNumberColumn
          />
        </LayoutSection>
      }
    </>
  );
};
