import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Heading3,
  TextLink,
  Icon,
  Modal,
  InfoBlock,
  Card,
} from "@stellar/design-system";

import { SendTransactionFlow } from "components/SendTransaction/SendTransactionFlow";
import { ReceiveTransaction } from "components/ReceiveTransaction";
import { LayoutSection } from "components/LayoutSection";
import { NATIVE_ASSET_CODE, STELLAR_EXPERT_URL } from "constants/settings";
import { startAccountWatcherAction } from "ducks/account";
import { resetSendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "types/types.d";
import { AssetBalance, NativeBalance } from "@stellar/wallet-sdk/dist/types";
import { knownTokens } from "../../utils/knownTokens";
import unknownAssetImage from "../../assets/unknownAsset.png";

import "./styles.scss";


export const BalanceInfo = () => {
  const dispatch = useDispatch();
  const { account } = useRedux("account");
  const { flaggedAccounts } = useRedux("flaggedAccounts");
  const {
    status: accountStatus,
    data,
    isAccountWatcherStarted,
    isUnfunded,
  } = account;
  const { status: flaggedAccountsStatus } = flaggedAccounts;
  const [isSendTxModalVisible, setIsSendTxModalVisible] = useState(false);
  const [isReceiveTxModalVisible, setIsReceiveTxModalVisible] = useState(false);
  const publicAddress = data?.id;

  useEffect(() => {
    if (
      publicAddress &&
      accountStatus === ActionStatus.SUCCESS &&
      !isAccountWatcherStarted
    ) {
      dispatch(startAccountWatcherAction(publicAddress));
    }
  }, [dispatch, publicAddress, accountStatus, isAccountWatcherStarted]);

  let nativeBalance = "0";
  let allAssets: [string, AssetBalance | NativeBalance][] | null = null;
  if (account.data) {
    allAssets = account.data.balances
      ? Object.entries(account.data.balances)
      : null;
    nativeBalance = account.data.balances
      ? account.data.balances.native.total.toString()
      : "0";
  }

  const resetModalStates = () => {
    dispatch(resetSendTxAction());
    setIsSendTxModalVisible(false);
    setIsReceiveTxModalVisible(false);
  };

  if (!data) {
    return null;
  }

  const checkAssetInfo = (asset: string): string => {
    const check = knownTokens.find(item => item.asset === asset);
    if (check) {
      return check.iconLink;
    }
    return unknownAssetImage;
  };

  return (
    <LayoutSection>
      <div className="BalanceInfo">
        <div className="BalanceInfo__balance">
          <Heading3>Your Balance</Heading3>
          <div className="BalanceInfo__balance__amount">
            <Card>{`${nativeBalance} Lumens (${NATIVE_ASSET_CODE})`} </Card>
          </div>

        </div>
        <div className="BalanceInfo__container">
          <a href="http://qadsanswap.org"
            target="_blank"
            rel="noreferrer"
            className="BalanceInfo__container_link">
            <Button>
              BUY/SELL QADSAN
            </Button>
          </a>
          <div className="BalanceInfo__buttons">
            <Button
              onClick={() => {
                setIsSendTxModalVisible(true);
              }}
              iconLeft={<Icon.Send />}
              disabled={
                isUnfunded || flaggedAccountsStatus !== ActionStatus.SUCCESS
              }
            >
              Send
          </Button>

            <Button
              onClick={() => {
                setIsReceiveTxModalVisible(true);
              }}
              iconLeft={<Icon.QrCode />}
            >
              Receive
          </Button>
          </div>
        </div>
      </div>
      <div className="Balance__list">
        {allAssets && allAssets.map(asset => (
          asset[0] === "native" ? '' :
            <Card key={asset[0]}>
              <div className="card__item">
                <img className="img"
                  src={checkAssetInfo(asset[0])}
                  alt={`${asset[1].token.code}`} />
                <div className="card__list">
                  <span className="card__item_text">{`${asset[1].total.toFormat(7)}`}</span>
                  <span className="card__item_text">{`${asset[1].token.code}`}</span>
                </div>
                <TextLink
                  href={`${STELLAR_EXPERT_URL}/public/asset/${asset[0]}`}
                  variant={TextLink.variant.secondary}
                >
                  <Icon.Search />
                </TextLink>
              </div>
            </Card>
        ))}
      </div>

      {isUnfunded && (
        <div className="BalanceInfo__unfunded">
          <Heading3>Your Stellar Public Key</Heading3>
          <code data-break>{publicAddress}</code>

          <InfoBlock variant={InfoBlock.variant.warning}>
            This account is currently inactive. To activate it,{" "}
            <TextLink href="https://developers.stellar.org/docs/glossary/minimum-balance/">
              {`send at least 1 lumen (${NATIVE_ASSET_CODE})`}
            </TextLink>{" "}
            to the Stellar public key displayed above.
          </InfoBlock>
        </div>
      )}

      <Modal
        visible={isSendTxModalVisible || isReceiveTxModalVisible}
        onClose={resetModalStates}
      >
        {isSendTxModalVisible && (
          <SendTransactionFlow
            onCancel={() => {
              setIsSendTxModalVisible(true);
              resetModalStates();
            }}
          />
        )}
        {isReceiveTxModalVisible && <ReceiveTransaction />}
      </Modal>
    </LayoutSection>
  );
};
