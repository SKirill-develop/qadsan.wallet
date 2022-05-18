import {
  Heading5,
  Button,
  Input,
  Layout,
  Modal,
  InfoBlock,
  Loader,
  TextLink,
} from "@stellar/design-system";
import { useState } from "react";
import StellarSdk from "stellar-sdk";
import { buildPaymentTransaction } from "helpers/buildPaymentTransaction";
import { ErrorMessage } from "components/ErrorMessage";
import styles from "pages/BuySellPage/BuySellPage.module.css";
import {
  walletExchange,
  exampleWalletForUSDT,
  exampleWalletForUSDC,
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

export const SellTokens = () => {
  const dispatch = useDispatch();
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
    return Math.round(summa - fee);
  };

  const validate = Number(amount) >= 500000;
  const amountQadsan = account?.data?.balances[QADSAN_ASSET].total.toString();

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
          placeholder={`Max: ${
            amountQadsan !== undefined ? amountQadsan : "0"
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
        <div className={styles.buy_sell_buttons}>
          <Button
            onClick={() => {
              setCurrency("USDT");
              setIsSendTxModalVisible(true);
            }}
            isLoading={txInProgress}
            disabled={!validate}
          >
            Sell QADSAN for USDT
          </Button>

          <Button
            onClick={() => {
              setCurrency("USDC");
              setIsSendTxModalVisible(true);
            }}
            isLoading={txInProgress}
            disabled={!validate}
          >
            Sell QADSAN for USDC
          </Button>
        </div>
        <p>* The transfer delay can be up to 24 hours</p>

        <Modal visible={isSendTxModalVisible} onClose={resetModalStates}>
          <Modal.Body>
            <Input
              id="2"
              label={`Your ${currency} wallet`}
              type="text"
              onChange={(e) => {
                setWallet(e.target.value);
              }}
              value={wallet}
              placeholder={
                currency === "USDC"
                  ? exampleWalletForUSDC
                  : exampleWalletForUSDT
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                onSubmit();
              }}
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
                  href={`${
                    getNetworkConfig(settings.isTestnet).stellarExpertTxUrl
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
                variant={Button.variant.secondary}
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
                variant={Button.variant.secondary}
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
