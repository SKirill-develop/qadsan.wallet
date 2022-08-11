import { Heading5, Input, Layout, Modal } from "@stellar/design-system";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from "react";
import { useRedux } from "../../hooks/useRedux";
import { sendNotification } from "../../utils/sendNotification";
import { createCheckouts } from "../../utils/createCheckoutsInCoinbase";
import { PaymentModule } from "../PaymentModule/PaymentModule";
import { walletForUSDT, walletForBinancePay } from "../../constants/walletsToPay";
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import style from './BuyTokens.module.css';

export const BuyTokens = () => {
  const [amount, setAmount] = useState("");
  const [isBinance, setIsBinance] = useState(false);
  const { prices } = useRedux("prices");
  const { account } = useRedux("account");
  const { binanceAccount } = useRedux("binanceAccount");
  const [isSendTxModalVisible, setIsSendTxModalVisible] = useState(false);
  const [isReceiveTxModalVisible, setIsReceiveTxModalVisible] = useState(false);
  const [isWalletForPayment, setIsWalletForPayment] = useState("");
  const [isCurrency, setIsCurrency] = useState("");
  const [isClickCoinbase, setIsClickCoinbase] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);
  const [loadingCoinbaseButton, setLoadingCoinbaseButton] = useState(false);
  const wallet = account.isAuthenticated ?
    account.data!.id : binanceAccount.wallet;

  const totalInDollSumma = () => {
    const summa = Number(amount) * prices.QADSAN.price;
    const fee = (summa / 100) * 0;
    return (summa + fee).toFixed(2);
  };

  const resetModalStates = () => {
    setIsSendTxModalVisible(false);
    setIsReceiveTxModalVisible(false);
  };

  const validate = Number(amount) >= 500000;

  const handlerClickCoinbaseButton = async () => {
    setLoadingCoinbaseButton(true);
    const checkId =
      await createCheckouts(wallet, totalInDollSumma(), amount);
    setCheckoutId(checkId);
    setLoadingCoinbaseButton(false);
  };

  return (
    <>
      <Layout.Inset>
        <Input
          id="1"
          label="Amount"
          type="number"
          rightElement="QADSAN"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          value={amount}
          placeholder="Min: 500000"
          error={validate ? "" : "The amount must be more than 500,000 QADSAN"}
        />
        {amount && validate && (
          <>
            <p className="Paragraph--secondary">
              <i>*0% service commission</i>
            </p>
            <Heading5>Total in $: {totalInDollSumma()}</Heading5>
          </>
        )}
        <div className="buttons-group">

          {(!isClickCoinbase || loadingCoinbaseButton) && (
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
              <Button
                onClick={() => {
                  setIsWalletForPayment(walletForBinancePay);
                  setIsCurrency("USDT");
                  setIsBinance(true);
                  setIsSendTxModalVisible(true);
                }}
                variant="contained"
                disabled={!validate}
              >
                Buy QADSAN using Binance Pay
            </Button>
              <LoadingButton
                loading={loadingCoinbaseButton}
                onClick={() => {
                  handlerClickCoinbaseButton();
                  setIsClickCoinbase(true);
                }}
                variant="contained"
                disabled={!validate}
              >
                Buy QADSAN using Coinbase
            </LoadingButton>
              <Button
                onClick={() => {
                  setIsWalletForPayment(walletForUSDT);
                  setIsCurrency("USDT");
                  setIsSendTxModalVisible(true);
                  setIsBinance(false);
                }}
                variant="contained"
                disabled={!validate}
              >
                Buy QADSAN for USDT (Tron)
            </Button>
            {account.isAuthenticated &&
              <Button variant="contained">
                <a className={style.link}
                  target="_blank"
                  href="https://interstellar.exchange/app/#/trade/GUEST/QADSAN/GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU/XLM/native">
                  Buy QADSAN for XLM</a>
              </Button>
              }
            </Stack>
          )}
          {isClickCoinbase && !loadingCoinbaseButton &&
            <Stack spacing={2} direction="row" justifyContent="center">
              {checkoutId === null || checkoutId === undefined ?
                <p style={{ color: 'red' }}>error</p> : (
                  <CoinbaseCommerceButton
                    className={style.coinbase__button}
                    onChargeSuccess={(data: any) => {
                      console.log(data);
                      sendNotification(
                        "onChargeSuccess",
                        wallet,
                        totalInDollSumma(),
                        amount,
                        "Coinbase",
                        wallet,
                      );
                    }}
                    onPaymentDetected={(data: any) => {
                      console.log(data);
                      sendNotification(
                        "onPaymentDetected",
                        wallet,
                        totalInDollSumma(),
                        amount,
                        "Coinbase",
                        wallet,
                      );
                    }}
                    customMetadata={wallet}
                    checkoutId={checkoutId} />)}
              <Button
                onClick={() => {
                  setIsClickCoinbase(false);
                }}
                variant="contained"
              >
                Back
        </Button>
            </Stack>
          }

        </div>
        <p>* Crediting QADSAN tokens may take some time.</p>
      </Layout.Inset>

      <Modal
        visible={isSendTxModalVisible || isReceiveTxModalVisible}
        onClose={resetModalStates}
      >
        <PaymentModule
          amountUST={totalInDollSumma()}
          amountQADSAN={amount}
          account={wallet}
          walletForPay={isWalletForPayment}
          currency={isCurrency}
          isBinance={isBinance}
        />
      </Modal>
    </>
  );
};
