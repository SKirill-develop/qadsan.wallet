import { useState, useEffect } from "react";
import StellarSdk from "stellar-sdk";
import { Modal, Input } from "@stellar/design-system";
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import { BigNumber } from "bignumber.js";
import { QADSAN_ASSET_IN_ARRAY } from "constants/settings";
import { LockBalanceData, NetworkCongestion } from "../../types/types.d";
import { useRedux } from "../../hooks/useRedux";
import {
  lumensFromStroops,
  stroopsFromLumens,
} from "../../helpers/stroopConversion";
import { getNetworkConfig } from "../../helpers/getNetworkConfig";
import { buildPaymentTransaction } from "../../helpers/buildPaymentTransaction";
import { LabelAndValue } from "../LabelAndValue";
import { LayoutRow } from "../LayoutRow";

enum SendFormIds {
  SEND_FEE = "send-fee",
  Amount = "amount",
}

type ValidatedInput = {
  [inputId: string]: string;
};

interface CreateLockerBalanceProps {
  maxFee: string;
  memo: string;
  onContinue: (formData: LockBalanceData) => void;
  onCancel: () => void;
  setMaxFee: (maxFee: string) => void;
}

export const CreateLockerTransaction = ({
  memo,
  maxFee,
  onContinue,
  onCancel,
  setMaxFee,
}: CreateLockerBalanceProps) => {
  const { account, settings } = useRedux("account", "settings");

  const initialInputErrors = {
    [SendFormIds.SEND_FEE]: "",
    [SendFormIds.Amount]: "",
  };

  const [amount, setAmount] = useState("");

  const [recommendedFee, setRecommendedFee] = useState(
    lumensFromStroops(StellarSdk.BASE_FEE).toString(),
  );

  const [networkCongestion, setNetworkCongestion] = useState(
    NetworkCongestion.LOW,
  );

  const [inputErrors, setInputErrors] =
    useState<ValidatedInput>(initialInputErrors);
  const [txInProgress, setTxInProgress] = useState(false);

  useEffect(() => {
    const fetchNetworkBaseFee = async () => {
      const server = new StellarSdk.Server(
        getNetworkConfig(settings.isTestnet).url,
      );
      try {
        const feeStats = await server.feeStats();
        const networkFee = lumensFromStroops(
          feeStats.fee_charged.mode,
        ).toString();
        setRecommendedFee(networkFee);
        if (
          feeStats.ledger_capacity_usage > 0.5 &&
          feeStats.ledger_capacity_usage <= 0.75
        ) {
          setNetworkCongestion(NetworkCongestion.MEDIUM);
        } else if (feeStats.ledger_capacity_usage > 0.75) {
          setNetworkCongestion(NetworkCongestion.HIGH);
        }
      } catch (err) {
        // use default values
      }
    };

    fetchNetworkBaseFee();
  }, [setMaxFee, settings.isTestnet]);

  const validateInput = (inputId: string) => {
    const errors: ValidatedInput = {};
    let message = "";

    switch (inputId) {
      case SendFormIds.SEND_FEE:
        // recommendedFee is minimum fee
        if (!maxFee) {
          message = "Please enter fee";
        } else if (new BigNumber(maxFee).lt(recommendedFee)) {
          message = `Fee is too small. Minimum fee is ${recommendedFee}.`;
        }
        errors[SendFormIds.SEND_FEE] = message;
        break;
        case SendFormIds.Amount:
          if (!amount) {
            message = "Please enter amount";
          } else if (new BigNumber(amount).lte(99)) {
            message = "Amount must be larger than 100";
          }
        errors[SendFormIds.Amount] = message;
          break;
      default:
        break;
    }

    return errors;
  };

  const validate = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputErrors({ ...inputErrors, ...validateInput(event.target.id) });
  };

  const clearInputError = (inputId: string) => {
    if (!inputErrors[inputId]) {
      return;
    }
    setInputErrors({ ...inputErrors, [inputId]: "" });
  };

  const onSubmit = async () => {
    let errors = {};
    let hasErrors = false;

    if (!account.data?.id) {
      setInputErrors({
        ...inputErrors,
      });
      return;
    }

    // Loop through inputs we need to validate
    Object.keys(inputErrors).forEach((inputId) => {
      errors = { ...errors, ...validateInput(inputId) };

      // Check if input has error message
      if (!hasErrors && validateInput(inputId)[inputId]) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setInputErrors(errors);
    } else {
      if (!account.data?.id) {
        setInputErrors({
          ...inputErrors,
          [SendFormIds.Amount]:
            "Something went wrong, account address is missing.",
        });
        return;
      }

    try {
      setTxInProgress(true);
      const tx = await buildPaymentTransaction({
        publicKey: account.data.id,
        assetsPay: QADSAN_ASSET_IN_ARRAY,
        amount,
        fee: stroopsFromLumens(recommendedFee).toNumber(),
        toAccountId: "GD4TAQ3V6KKWA6HGLGL7G7B7PYQI7YCEZMVGNLJ7IN4BSM65BHIVHLSX",
        memoType: StellarSdk.MemoText,
        memoContent: memo,
        isAccountFunded: true,
      });
      setTxInProgress(false);

      onContinue({
        tx,
      });
    } catch (e) {
      setTxInProgress(false);
    }
  }
  };
  return (
    <>
      <Modal.Heading>Confirm transaction</Modal.Heading>

      <Modal.Body>
        <LabelAndValue label="Send QADSAN to">
          GD4TAQ3V6KKWA6HGLGL7G7B7PYQI7YCEZMVGNLJ7IN4BSM65BHIVHLSX
        </LabelAndValue>

        <LabelAndValue label="Amount">
          <Input
            id={SendFormIds.Amount}
            rightElement="QADSAN"
            type="number"
            onChange={(e) => {
              clearInputError(e.target.id);
              setAmount(e.target.value);
            }}
            onBlur={validate}
            value={amount.toString()}
            error={inputErrors[SendFormIds.Amount]}
            placeholder="Min: 100 QADSAN"
          />
        </LabelAndValue>

        <LabelAndValue label="Period">{memo}</LabelAndValue>

        <LayoutRow>
          <Input
            id={SendFormIds.SEND_FEE}
            label="Fee"
            rightElement="lumens"
            type="number"
            onChange={(e) => {
              clearInputError(e.target.id);
              setMaxFee(e.target.value);
            }}
            error={inputErrors[SendFormIds.SEND_FEE]}
            value={recommendedFee}
            disabled
            note={
              <>
                <span className={`Congestion Congestion--${networkCongestion}`}>
                  {networkCongestion.toUpperCase()} congestion!
                </span>
                <br />
                Recommended fee: {recommendedFee}.
              </>
            }
          />
        </LayoutRow>
      </Modal.Body>

      <Modal.Footer>
        <LoadingButton onClick={onSubmit} loading={txInProgress} variant="contained">
          Continue
        </LoadingButton>
        <Button
          disabled={txInProgress}
          onClick={onCancel}
          variant="outlined"
        >
          Cancel
        </Button>
      </Modal.Footer>

      {txInProgress && (
        <p className="Paragraph--secondary align--right">
          Validating transaction
        </p>
      )}
    </>
  );
};
