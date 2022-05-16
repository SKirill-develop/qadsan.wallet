import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Button,
  Heading3,
  Eyebrow,
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
  const { prices } = useRedux("prices");
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
  const [showOtherAssets, setShowAllClaim] = useState(false);

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

  let nativeBalance = 0;
  let allAssets: [string, AssetBalance | NativeBalance][] | null = null;
  if (account.data) {
    allAssets = account.data.balances
      ? Object.entries(account.data.balances)
      : null;
    nativeBalance = account.data.balances
      ? Number(account.data.balances.native.total)
      : 0;
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
    const check = knownTokens.find((item) => item.asset === asset);
    if (check) {
      return check.iconLink;
    }
    return unknownAssetImage;
  };

  const XLMInDoll: number = Number(
    (nativeBalance * prices.XLM.price).toFixed(2),
  );

  const AssetInDoll = (amount: number): number =>
    Number((amount * prices.QADSAN.price).toFixed(2));

  let totalInDoll = XLMInDoll;

  const checkQadsan = allAssets?.find(
    (item) =>
      item[0] ===
      "QADSAN:GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU",
  );
  if (checkQadsan) {
    const amounts = Number(checkQadsan[1].total) * prices.QADSAN.price;
    totalInDoll = XLMInDoll + amounts;
  }

  const filterKnownAssets = allAssets?.filter(
    (e) => knownTokens.find((obj) => obj.asset === e[0]) !== undefined,
  );

  const filterNoKnownAssets = allAssets?.filter(
    (e) => knownTokens.find((obj) => obj.asset === e[0]) === undefined,
  );

  return (
    <LayoutSection>
      <div className="BalanceInfo">
        <div className="BalanceInfo__balance">
          <Heading3>Your Balance ≈ ${totalInDoll.toFixed(2)}</Heading3>
          <div className="BalanceInfo__balance__amount">
            <Card>
              <Heading3>{`${nativeBalance} Lumens (${NATIVE_ASSET_CODE})`}</Heading3>
              <Eyebrow>{`≈ $${XLMInDoll}`}</Eyebrow>
            </Card>
          </div>
        </div>
        <div className="BalanceInfo__container">
          <Link to="/buy-sell" className="BalanceInfo__container_link">
            <Button>BUY/SELL QADSAN</Button>
          </Link>
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
      {allAssets && (
        <>
          <div className="Balance__list">
            {filterKnownAssets &&
              filterKnownAssets.map((asset) =>
                asset[0] === "native" ? (
                  ""
                ) : (
                  <Card key={asset[0]}>
                    <div className="card__item">
                      <img
                        className="img"
                        src={checkAssetInfo(asset[0])}
                        alt={`${asset[1].token.code}`}
                      />
                      <div className="card__list">
                        <span className="card__item_text">{`${asset[1].total.toFormat(
                          7,
                        )}`}</span>
                        <span className="card__item_text">{`${asset[1].token.code}`}</span>
                        {asset[0] ===
                        "QADSAN:GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU" ? (
                          <span className="card__item_text">{`≈ $${AssetInDoll(
                            Number(asset[1].total),
                          )}`}</span>
                        ) : (
                          ""
                        )}
                      </div>
                      <TextLink
                        href={`${STELLAR_EXPERT_URL}/public/asset/${asset[0]}`}
                        variant={TextLink.variant.secondary}
                      >
                        <Icon.Search />
                      </TextLink>
                    </div>
                  </Card>
                ),
              )}
          </div>
          <TextLink
            onClick={() => setShowAllClaim(!showOtherAssets)}
            variant={TextLink.variant.secondary}
            underline
          >
            {!showOtherAssets ? "Show other assets" : "Hide other assets"}
          </TextLink>
          {showOtherAssets && (
            <div className="Balance__list">
              {filterNoKnownAssets &&
                filterNoKnownAssets.map((asset) =>
                  asset[0] === "native" ? (
                    ""
                  ) : (
                    <Card key={asset[0]}>
                      <div className="card__item">
                        <img
                          className="img"
                          src={checkAssetInfo(asset[0])}
                          alt={`${asset[1].token.code}`}
                        />
                        <div className="card__list">
                          <span className="card__item_text">{`${asset[1].total.toFormat(
                            7,
                          )}`}</span>
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
                  ),
                )}
            </div>
          )}
        </>
      )}
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
