import {
  Heading5,
  Input,
  Layout,
  Modal,
  InfoBlock,
  Loader,
  TextLink,
} from "@stellar/design-system";
import { useState } from "react";
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import StellarSdk from "stellar-sdk";
import { buildPaymentTransaction } from "helpers/buildPaymentTransaction";
import { ErrorMessage } from "components/ErrorMessage";
import { AppDispatch } from "config/store";
import {
  walletExchange,
  exampleWalletForUSDT,
  exampleWalletForBINANCE,
} from "constants/walletsToPay";
import { QADSAN_ASSET_IN_ARRAY, QADSAN_ASSET } from "constants/settings";
import { useDispatch } from "react-redux";
import { sendTxAction } from "ducks/sendTx";
import { ActionStatus, AuthType } from "types/types.d";
import { getInstructionsMessage } from "utils/getInstructionsMessage";
import { resetSendTxAction } from "../../ducks/sendTx";
import { getNetworkConfig } from "../../helpers/getNetworkConfig";
import {
  lumensFromStroops,
  stroopsFromLumens,
} from "../../helpers/stroopConversion";
import { sendNotification } from "../../utils/sendNotification";
import { useRedux } from "../../hooks/useRedux";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import style from './SellTokens.module.css';

export const SellTokens = () => {
  const dispatch: AppDispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [txInProgress, setTxInProgress] = useState(false);
  const { prices, account, settings, sendTx } = useRedux(
    "prices",
    "account",
    "settings",
    "sendTx",
  );
  const { status } = sendTx;
  const [isSendTxModalVisible, setIsSendTxModalVisible] = useState(false);
  const [wallet, setWallet] = useState("");
  const [currency, setCurrency] = useState("");
  const [recommendedFee, setRecommendedFee] = useState(
    lumensFromStroops(StellarSdk.BASE_FEE).toString(),
  );

  const totalInDollSumma = () => {
    const summa = Number(amount) * prices.QADSAN.price;
    const fee = (summa / 100) * 5;
    return Number((summa - fee).toFixed(2));
  };

  const validate = Number(amount) >= 500000;

  let amountQadsan = '0';
  if (account?.data?.balances) {
    amountQadsan = account?.data?.balances[QADSAN_ASSET].total.toString();
  }

  const resetModalStates = () => {
    setIsSendTxModalVisible(false);
    dispatch(resetSendTxAction());
  };

  const onSubmit = async () => {
    if (!account.data?.id) {
      return;
    }

    const server = new StellarSdk.Server(
      getNetworkConfig(settings.isTestnet).url,
    );

    try {
      const feeStats = await server.feeStats();
      const networkFee = lumensFromStroops(
        feeStats.fee_charged.mode,
      ).toString();
      setRecommendedFee(networkFee);
      setTxInProgress(true);

      const tx = await buildPaymentTransaction({
        publicKey: account.data.id,
        toAccountId: walletExchange,
        assetsPay: QADSAN_ASSET_IN_ARRAY,
        amount,
        fee: stroopsFromLumens(recommendedFee).toNumber(),
        memoType: StellarSdk.MemoText,
        memoContent: `Exchange to ${currency}`,
        isAccountFunded: true,
      });

      dispatch(sendTxAction(tx));

      setTxInProgress(false);
      sendNotification(
        "Sell",
        account.data.id,
        amount,
        totalInDollSumma(),
        currency,
        wallet,
      );
    } catch (e) {
      setTxInProgress(false);
    }
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
          placeholder={`Max: ${amountQadsan !== undefined ? amountQadsan : "0"
            }`}
          error={validate ? "" : "The amount must be more than 500,000 QADSAN"}
        />
        {amount && validate && (
          <>
            <p className="Paragraph--secondary">
              <i>*5% service commission</i>
            </p>
            <Heading5>Total in $: {totalInDollSumma()}</Heading5>
          </>
        )}
        <div className="buttons-group">
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
            <LoadingButton
              onClick={() => {
                setCurrency("USDT");
                setIsSendTxModalVisible(true);
              }}
              loading={txInProgress}
              variant="contained"
              disabled={!validate}
            >
              Sell QADSAN for USDT (TRON)
          </LoadingButton>
            <Button
              onClick={() => {
                setCurrency("BINANCE USDT");
                setIsSendTxModalVisible(true);
              }}
              disabled={!validate}
              variant="contained"
            >
              Sell QADSAN for BINANCE PAY
          </Button>
            <Button variant="contained">
              <a className={style.link}
                target="_blank"
                href="https://stellarterm.com/exchange/QADSAN-GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU/XLM-native">
                Sell QADSAN for XLM</a>
            </Button>
          </Stack>
        </div>
        <p>* May take some time.</p>

        <Modal visible={isSendTxModalVisible} onClose={resetModalStates}>
          <Modal.Body>
            <Input
              id="2"
              label={`Your ${currency} ${currency === "BINANCE USDT"
              || currency === "BINANCE USDC" ? 'Pay ID' : 'wallet'}`}
              type="text"
              onChange={(e) => {
                setWallet(e.target.value);
              }}
              value={wallet}
              /* eslint no-nested-ternary: off */
              placeholder={
                    currency === "USDT"
                    ? exampleWalletForUSDT
                    : exampleWalletForBINANCE
              }
            />
            {currency === "BINANCE USDT" || currency === "BINANCE USDC" ?
            <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              <FormControlLabel value="BINANCE USDT" control={<Radio />} label="USDT" />
              <FormControlLabel value="BINANCE USDC" control={<Radio />} label="USDC" />
            </RadioGroup>
            </FormControl>
            : ''}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                onSubmit();
              }}
              disabled={wallet === ''}
              variant="contained"
            >
              Sell QADSAN for {currency}
            </Button>
          </Modal.Footer>
        </Modal>

        {status === ActionStatus.PENDING &&
          settings.authType &&
          settings.authType !== AuthType.PRIVATE_KEY && (
            <Modal visible={isSendTxModalVisible} onClose={resetModalStates}>
              <Modal.Heading>
                <div className="Loader__container">
                  <Loader size="5rem" />
                </div>
              </Modal.Heading>
              <Modal.Body>
                <InfoBlock>
                  {getInstructionsMessage(settings.authType)}
                </InfoBlock>
              </Modal.Body>
            </Modal>
          )}

        {status === ActionStatus.SUCCESS && (
          <Modal visible={isSendTxModalVisible} onClose={resetModalStates}>
            <Modal.Heading>Transaction successfully completed</Modal.Heading>

            <Modal.Body>
              <p className="align--center">
                <TextLink
                  href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl
                    }${sendTx?.data?.id}`}
                >
                  See details on StellarExpert
                </TextLink>
              </p>
              <p>* The transfer delay can be up to 24 hours</p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                onClick={resetModalStates}
                variant="contained"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {status === ActionStatus.ERROR && (
          <Modal visible={isSendTxModalVisible} onClose={resetModalStates}>
            <Modal.Heading>Transaction failed</Modal.Heading>

            <Modal.Body>
              <p>See details below for more information.</p>
              <ErrorMessage message={`Error: ${sendTx.errorString}`} />
              {settings.authType === AuthType.PRIVATE_KEY ? (
                <ErrorMessage
                  message="The attempted operation may not be supported on this wallet yet."
                  fontSize="var(--font-size-secondary)"
                />
              ) : null}
            </Modal.Body>

            <Modal.Footer>
              <Button
                onClick={resetModalStates}
                variant="contained"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Layout.Inset>
    </>
  );
};
