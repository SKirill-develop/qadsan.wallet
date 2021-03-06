import { useEffect } from "react";
import moment from "moment";
import { Horizon } from "stellar-sdk";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import {
  Heading2,
  Loader,
  TextLink,
  Identicon,
  Layout,
  Table,
} from "@stellar/design-system";
import { Types } from "@stellar/wallet-sdk";

import {
  fetchTxHistoryAction,
  startTxHistoryWatcherAction,
} from "ducks/txHistory";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { getMemoTypeText } from "helpers/getMemoTypeText";
import { ErrorMessage } from "components/ErrorMessage";
import { AppDispatch } from "config/store";
import { ActionStatus } from "types/types.d";

export const TransactionHistory = () => {
  const { account, txHistory, settings } = useRedux(
    "account",
    "txHistory",
    "settings",
  );
  const accountId = account.data?.id;
  const isUnfunded = account.isUnfunded;
  const dispatch: AppDispatch = useDispatch();
  const { status, data, isTxWatcherStarted, errorString, hasMoreTxs } =
    txHistory;

  const { errorMessage } = useErrorMessage({ initialMessage: errorString });

  useEffect(() => {
    if (accountId && !isUnfunded) {
      dispatch(fetchTxHistoryAction(accountId));
    }
  }, [accountId, isUnfunded, dispatch]);

  useEffect(() => {
    if (status === ActionStatus.SUCCESS && accountId && !isTxWatcherStarted) {
      dispatch(startTxHistoryWatcherAction(accountId));
    }
  }, [status, isTxWatcherStarted, accountId, dispatch]);

  const isAccountMerge = (pt: Types.Payment) =>
    pt.type === Horizon.OperationResponseType.accountMerge;

  const getPublicAddress = (pt: Types.Payment) =>
    pt.mergedAccount?.publicKey || pt.otherAccount?.publicKey;

  const getFormattedAmount = (pt: Types.Payment) => {
    if (!pt?.amount) {
      return "";
    }
    const amount = new BigNumber(pt.amount).toString();
    const { isRecipient, token } = pt;
    return `${(isRecipient ? "+" : "-") + amount} ${token.code}`;
  };

  const getFormattedMemo = (pt: Types.Payment) => {
    const memoType = getMemoTypeText(pt.memoType);

    return (
      <div
        className="TransactionHistory__memo"
        aria-hidden={!memoType && !pt.memo}
      >
        {/* {memoType && <code>{memoType}</code>} */}
        {pt.memo && <span>{pt.memo.toString()}</span>}
      </div>
    );
  };

  const tableColumnLabels = [
    {
      id: "timestamp",
      label: "Date/Time",
    },
    {
      id: "address",
      label: "Address",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "memo",
      label: "Memo",
    },
    {
      id: "id",
      label: "Operation ID",
    },
  ];

  const renderTableRow = (item: Types.Payment) => (
    <>
      <td>{moment.unix(item.timestamp).format("D/MM/YYYY HH:mm")}</td>
      <td>
        <Identicon publicAddress={getPublicAddress(item)} shortenAddress />
      </td>
      <td>
        {isAccountMerge(item) && <code>account merge</code>}
        <span>{getFormattedAmount(item)}</span>
      </td>
      <td>{getFormattedMemo(item)}</td>
      <td>
        <TextLink
          href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl}${item.transactionId
            }`}
          variant={TextLink.variant.secondary}
          underline
        >
          {item.id}
        </TextLink>
      </td>
    </>
  );

  return (
    <div className="TransactionHistory DataSection">
      <Layout.Inset>
        <div className="TransactionHistory__header">
          <Heading2>Payments History</Heading2>
        </div>

        <ErrorMessage message={errorMessage} marginBottom="2rem" />
        {status === ActionStatus.PENDING ? (
          <div className="Loader__container">
            <Loader size="5rem" />
          </div>
        ) : (
          <Table
            breakpoint={900}
            columnLabels={tableColumnLabels}
            data={data}
            renderItemRow={renderTableRow}
            emptyMessage="There are no payments to show"
            hideNumberColumn
          />
        )}
        {hasMoreTxs && (
          <div className="TableNoteContainer">
            <TextLink
              href={`${getNetworkConfig(settings.isTestnet).stellarExpertAccountUrl
                }${accountId}`}
            >
              View full list of transactions
            </TextLink>
          </div>
        )}
      </Layout.Inset>
    </div>
  );
};
