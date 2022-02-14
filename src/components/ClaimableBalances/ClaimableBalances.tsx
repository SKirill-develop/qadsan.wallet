import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  Heading2,
  Identicon,
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
import { AssetType } from "types/types.d";
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
  const [balanceId, setBalanceId] = useState<string>("");
  const [balanceAsset, setBalanceAsset] = useState<Asset>(Asset.native());

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

  if (!claimableBalances?.data.length) {
    return null;
  }

  const getClaimBalanceHeader = () =>
    `Claimable ${claimableBalances?.data.length === 1 ? "Balance" : "Balances"}`;

  const getAssetLink = (asset: { code: string; issuer: string }) => {
    let assetString;

    if (asset.code === AssetType.NATIVE) {
      assetString = NATIVE_ASSET_CODE;
    } else {
      assetString = `${asset.code}-${asset.issuer}`;
    }

    return `${getNetworkConfig(settings.isTestnet).stellarExpertAssetUrl
      }${assetString}`;
  };

  return (
    <div className="ClaimableBalances DataSection">
      <Layout.Inset>
        <Heading2>{getClaimBalanceHeader()}</Heading2>

        <Table
          columnLabels={[
            { id: "cb-asset", label: "Asset" },
            { id: "cb-amount", label: "Amount" },
            { id: "cb-claimants", label: "Available after" },
            { id: "cb-sponsor", label: "Address" },
            { id: "cb-claim", label: "Claim" },
          ]}
          data={claimableBalances.data}
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
                {cb.claimants[0].predicate.unconditional ? 'Pending' :  moment.unix(cb.claimants[0].predicate.not.abs_before_epoch).format("D/MM/YYYY HH:mm") }
              </td>
              <td>
                <Identicon publicAddress={cb.sponsor} shortenAddress />
              </td>
              <td>
                { !cb.claimants[0].predicate.unconditional &&
                moment().format("D/MM/YYYY HH:mm") < moment.unix(cb.claimants[0].predicate.not.abs_before_epoch).format("D/MM/YYYY HH:mm") ?
              <Button
                    disabled
                >
              Claim
            </Button>  
              :
                <Button
                  onClick={() => {
                    if (cb.asset.code === AssetType.NATIVE) {
                      setBalanceAsset(Asset.native());
                    } else {
                      setBalanceAsset(
                        new Asset(cb.asset.code, cb.asset.issuer),
                      );
                    }
                    setBalanceId(cb.id);
                    handleShow();
                  }
                  }
                >
                  Claim
                </Button>
                }
              </td>
            </>
          )}
          hideNumberColumn
        />
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
