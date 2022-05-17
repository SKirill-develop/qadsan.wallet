import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  Heading2,
  Identicon,
  Loader,
  Layout,
  TextLink,
  Table,
  Modal,
  Button,
} from "@stellar/design-system";
import { NATIVE_ASSET_CODE } from "constants/settings";
import { fetchClaimableBalancesAction } from "ducks/claimableBalances";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { formatAmount } from "helpers/formatAmount";
import { useRedux } from "hooks/useRedux";
import { AssetType, ActionStatus } from "types/types.d";
import { Asset } from "stellar-sdk";
import { SendTransactionFlow } from "components/ClaimableBalances/SendClaimClaimableBalanceFlow";
import { resetSendTxAction } from "ducks/sendTx";

export const ClaimableBalances = () => {
  const { account, claimableBalances, settings } = useRedux(
    "account",
    "claimableBalances",
    "settings",
  );
  const [IsClaimTxModalVisible, setIsClaimTxModalVisible] = useState(false);
  const [balanceId, setBalanceId] = useState("");
  const [balanceAsset, setBalanceAsset] = useState(Asset.native());
  const [showAllClaim, setShowAllClaim] = useState(false);

  const handleShow = () => {
    setIsClaimTxModalVisible(true);
  };

  const resetModalStates = () => {
    setIsClaimTxModalVisible(false);
    setBalanceId("");
    setBalanceAsset(Asset.native());
  };

  const accountId = account.data?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchClaimableBalancesAction(accountId));
    }
  }, [accountId, dispatch]);

  const getClaimBalanceHeader = () =>
    `Claimable ${
      claimableBalances?.data.length === 1 ? "Balance" : "Balances"
    }`;

  const getAssetLink = (asset: { code: string; issuer: string }) => {
    let assetString;

    if (asset.code === AssetType.NATIVE) {
      assetString = NATIVE_ASSET_CODE;
    } else {
      assetString = `${asset.code}-${asset.issuer}`;
    }

    return `${
      getNetworkConfig(settings.isTestnet).stellarExpertAssetUrl
    }${assetString}`;
  };

  const qadsanFilter = claimableBalances.data.filter(
    (item) =>
      item.asset.code === "QADSAN" &&
      item.asset.issuer ===
        "GAOLE7JSN4OB7344UCOOEGIHEQY2XNLCW6YHKOCGZLTDV4VRTXQM27QU",
  );

  return (
    <div className="ClaimableBalances DataSection">
      <Layout.Inset>
        <Heading2>{getClaimBalanceHeader()}</Heading2>
        {claimableBalances.status === ActionStatus.PENDING ? (
          <div className="Loader__container">
            <Loader size="5rem" />
          </div>
        ) : (
          <>
            <TextLink
              onClick={() => setShowAllClaim(!showAllClaim)}
              variant={TextLink.variant.secondary}
              underline
            >
              {!showAllClaim ? "Show all payments" : "Show only QADSAN"}
            </TextLink>

            <Table
              columnLabels={[
                { id: "cb-asset", label: "Asset" },
                { id: "cb-amount", label: "Amount" },
                { id: "cb-claimants", label: "Available after" },
                { id: "cb-sponsor", label: "Address" },
                { id: "cb-claim", label: "Claim" },
              ]}
              data={showAllClaim ? claimableBalances.data : qadsanFilter}
              renderItemRow={(cb) => (
                <>
                  <td>
                    <TextLink
                      href={getAssetLink(cb.asset)}
                      variant={TextLink.variant.secondary}
                      underline
                    >
                      {cb.asset.code === AssetType.NATIVE
                        ? NATIVE_ASSET_CODE
                        : cb.asset.code}
                    </TextLink>
                  </td>
                  <td>{formatAmount(cb.amount)}</td>
                  <td>
                    {cb.claimants[0] === accountId &&
                    cb.claimants[0].predicate.unconditional
                      ? "Pending"
                      : cb.claimants[0].predicate.not !== undefined &&
                        moment
                          .unix(cb.claimants[0].predicate.not?.abs_before_epoch)
                          .format("D/MM/YYYY HH:mm")}
                  </td>
                  <td>
                    <Identicon publicAddress={cb.sponsor} shortenAddress />
                  </td>
                  <td>
                    {!cb.claimants[0].predicate.unconditional &&
                    moment() <
                      moment.unix(
                        cb.claimants[0].predicate.not?.abs_before_epoch,
                      ) ? (
                      <Button disabled>Claim</Button>
                    ) : (
                      <Button
                        onClick={() => {
                          // eslint-disable-next-line no-unused-expressions
                          cb.asset.code === AssetType.NATIVE
                            ? setBalanceAsset(Asset.native())
                            : setBalanceAsset(
                                new Asset(cb.asset.code, cb.asset.issuer),
                              );

                          setBalanceId(cb.id);
                          handleShow();
                        }}
                      >
                        Claim
                      </Button>
                    )}
                  </td>
                </>
              )}
              emptyMessage="There are no pending payments to show"
              hideNumberColumn
            />
          </>
        )}
        <Modal visible={IsClaimTxModalVisible} onClose={resetModalStates}>
          {IsClaimTxModalVisible && (
            <SendTransactionFlow
              onCancel={() => {
                setIsClaimTxModalVisible(true);
                resetModalStates();
              }}
              onSuccess={() => {
                if (accountId) {
                  dispatch(fetchClaimableBalancesAction(accountId));
                }
                dispatch(resetSendTxAction());
                setIsClaimTxModalVisible(true);
                resetModalStates();
              }}
              balanceId={balanceId}
              balanceAsset={balanceAsset}
            />
          )}
        </Modal>
      </Layout.Inset>
    </div>
  );
};
