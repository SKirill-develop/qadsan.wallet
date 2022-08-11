import { useState } from "react";
import { useRedux } from "../../../hooks/useRedux";
import {CreatePaymentStrictReceiveTransaction} from './CreatePaymentStrictReceiveTransaction';
import {SuccessfulPaymentStrictReceiveTransaction} from '../SuccessfulPaymentStrictReceiveTransaction';
import {FailedPaymentStrictReceiveTransaction} from '../FailedPaymentStrictReceiveTransaction';

interface BuyFormData {
  token: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BuyToken = ({token, onCancel, onSuccess}: BuyFormData) => {
  const [currentStage, setCurrentStage] = useState('CREATE');
  const { prices } = useRedux("prices");

  const Token: any =
  prices.Tokens.find((item: { name: string }) => item.name === token);

  const tokenName: string = token.split(':')[0];
  const assetIssuer: string = token.split(':')[1];
  let slice: number = 5;
  if(tokenName ==="ELPPA" || tokenName === "ALSET" || tokenName === "INDEX"){
    slice = 10;
  }
  const percent: number = (Token.price_now * slice)/100;
  const price: number= Token.price_now;
  const destMin: number = price + percent;

  return (
    <>
      {currentStage === 'CREATE' && (
        <CreatePaymentStrictReceiveTransaction
          onSuccessfulTx={() => {
            setCurrentStage('SUCCESS');
          }}
          onFailedTx={() => {
            setCurrentStage('ERROR');
          }}
        token = {tokenName}
        assetIssuer={assetIssuer}
        onCancel={onCancel}
        destMin={destMin}
        />
      )}
      {currentStage === 'SUCCESS' && (
        <SuccessfulPaymentStrictReceiveTransaction onCancel={onSuccess} />
      )}
      {currentStage === 'ERROR' && (
        <FailedPaymentStrictReceiveTransaction
          onCancel={onCancel}
        />
      )}
    </>
  );
};
