import { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_FEE } from "stellar-sdk";
import { LockBalanceData } from "../../types/types.d";
import { lumensFromStroops } from "../../helpers/stroopConversion";
import { resetSendTxAction } from "../../ducks/sendTx";
import { CreateLockerTransaction } from "./CreateLockerTransaction";
import { ConfirmLockerTransaction } from "./ConfirmLockerTransaction";
import { SuccessfulLockerTransaction } from "./SuccessfulLockerTransaction";
import { FailedLockerTransaction } from "./FailedLockerTransaction";

// CREATE -> CONFIRM -> SUCCESS || ERROR
enum SendState {
  CREATE,
  CONFIRM,
  SUCCESS,
  ERROR,
}
interface LockFormData {
  memo: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialFormData: LockBalanceData = {
  tx: undefined,
};

export const LockerFlow = ({ memo, onCancel, onSuccess }: LockFormData) => {
  const dispatch = useDispatch();

  const [currentStage, setCurrentStage] = useState(SendState.CREATE);
  const [formData, setFormData] = useState(initialFormData);
  const [maxFee, setMaxFee] = useState(lumensFromStroops(BASE_FEE).toString());

  const handleBack = () => {
    setCurrentStage(SendState.CREATE);
    dispatch(resetSendTxAction());
  };

  return (
    <>
      {currentStage === SendState.CREATE && (
        <CreateLockerTransaction
          onContinue={(newFormData) => {
            setFormData(newFormData);
            setCurrentStage(currentStage + 1);
          }}
          memo={memo}
          onCancel={onCancel}
          setMaxFee={setMaxFee}
          maxFee={maxFee}
        />
      )}

      {currentStage === SendState.CONFIRM && (
        <ConfirmLockerTransaction
          onSuccessfulTx={() => {
            setCurrentStage(SendState.SUCCESS);
          }}
          onFailedTx={() => {
            setCurrentStage(SendState.ERROR);
          }}
          onBack={handleBack}
          formData={formData}
          maxFee={maxFee}
        />
      )}

      {currentStage === SendState.SUCCESS && (
        <SuccessfulLockerTransaction onCancel={onSuccess} />
      )}

      {currentStage === SendState.ERROR && (
        <FailedLockerTransaction
          onEditTransaction={handleBack}
          onCancel={onCancel}
        />
      )}
    </>
  );
};
