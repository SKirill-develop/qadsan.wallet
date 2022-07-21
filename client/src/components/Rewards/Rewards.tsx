import { useState, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { rewardPayment } from "utils/rewardPayment";
import { knownTokens } from "utils/knownTokens";
import { useRedux } from "hooks/useRedux";
import style from './Rewards.module.css';
import { Heading6, Layout } from '@stellar/design-system';


export const Rewards = () => {
  const { account } = useRedux("account");
  const [buttonDisable, setButtonDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [winToken, setWinToken] = useState('');
  const [winAmount, setWinAmount] = useState('');
  const [winText, setWinText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setButtonDisable(false);
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const handleRewardButton = () => {
    setLoading(true);

    const random = Math.floor(Math.random() * (13 - 3 + 1)) + 3;

    const randomToken = knownTokens.find(item => item.id === random);
    const maxAmount = randomToken?.name === "ALSET" ? 10 : 1000;
    const randomAmount = Math.floor(Math.random() * (maxAmount - 1 + 1)) + 1;
    if (randomToken) {
      setWinToken(randomToken.name);
    }

    setWinAmount(randomAmount.toString());
    setWinText(true);

    if (account?.data?.id && randomToken) {
      rewardPayment(
        account.data.id,
        randomAmount.toString(),
        randomToken.name,
        randomToken.issuer,
        account.user_id,
        account.partner,
      )
        .then(res => {
          console.log(res);
          if (res.error) {
            setSuccessMessage('');
            setErrorMessage(res.message);
          } else {
            setErrorMessage('');
            setSuccessMessage('Transaction successful');
          }
          setSeconds(30);
          setButtonDisable(true);
          setLoading(false);
        });
    }
  };

  return (
    <Layout.Inset>
      <Heading6>
        By trading QADSAN token-shares,
        you automatically receive a reward for each
        buy-sell transaction (swap) of 0.5% of the transaction amount.*
        </Heading6>
      <Heading6>
        The reward is accrued in token-shares
        of virtual companies that you trade.
        </Heading6>
      <Heading6>
        Senior partners, also receive an affiliate reward (Partner Swap Reward)
        of 20% of their junior partners' trades.
        </Heading6>
      <Heading6>
        Share your QADSAN Wallet affiliate link on social
        networks and invite more partners to earn a steady income.
        </Heading6>
      <Heading6>
        No matter whether the price of token-shares falls or
        rises - you get a commission as a broker.
        The higher the amount of trades and
        their number, the higher your Profit!
        </Heading6>
      <Heading6>
        *The amount of reward can
        both increase and decrease depending on the trading activity.
        </Heading6>
      <Heading6>
        Senior partners, also receive an
        affiliate reward equal to 20% of their junior partners' rewards.
      </Heading6>
      <div className={style.contain}>
      {winText &&
        <h3> You win : {winAmount} {winToken}</h3>
      }
      { minutes === 0 && seconds === 0
        ? null
        : <h1> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
      }
      <LoadingButton variant="contained"
        loading={loading}
        disabled={buttonDisable}
        onClick={handleRewardButton}>
        Get Reward
        </LoadingButton>
      <p className={style.error}>{errorMessage}</p>
      <p className={style.success}>{successMessage}</p>
    </div>
    </Layout.Inset>
  );
};
