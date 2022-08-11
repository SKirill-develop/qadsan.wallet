import { useState, useEffect, useCallback } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { rewardPayment, getTopUsers } from "utils/rewardPayment";
import { knownTokens } from "utils/knownTokens";
import { useRedux } from "hooks/useRedux";
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Heading6, Heading3, Layout, Table } from '@stellar/design-system';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import img from 'assets/rewards-august.jpg';
import style from './Rewards.module.css';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const Rewards = () => {
  const { account } = useRedux("account");
  const [buttonDisable, setButtonDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [winToken, setWinToken] = useState('');
  const [winAmount, setWinAmount] = useState('');
  const [top, setTop] = useState<any>([]);
  const [winText, setWinText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [googleTokens, setGoogleTokens] = useState('');

  useEffect(() => {
    getTopUsers().then(res => setTop(res));
  }, []);

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

    const random = Math.floor(Math.random() * (13 - 1 + 1)) + 1;

    const randomToken = knownTokens.find(item => item.id === random);
    const maxAmount = randomToken?.name === "ALSET"
      || randomToken?.name === "INDEX" ? 10 : 500;
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
        googleTokens,
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

  const onVerify = useCallback((token: string) => {
    setGoogleTokens(token);
  }, [buttonDisable]);

  return (
    <Layout.Inset>
      <GoogleReCaptchaProvider
        reCaptchaKey="6Lcx8hYhAAAAAK1tnWdUchzojF7917BBqUh-erpm">
        <div className={style.title}>
          <img src={img} alt="img" className={style.img} />
          <Heading3>
            Get the SUPER Reward!
          </Heading3>
        </div>
        <AutoPlaySwipeableViews interval={5000}>
          <Heading6>
            Participate in the monthly free raffle by simply
            claiming a reward and get token-shares for FREE.
          </Heading6>
          <Heading6>
            Every month LUCK may smile on you - just click the
            GET REWARD button, get free token-shares of
            one of the 10 virtual companies,
            and have the CHANCE to get the SUPER Reward as well!
          </Heading6>
          <Heading6>
            This month you can get 10,000,000 LAPYAP token-shares.
          </Heading6>
          <Heading6>
            Senior Partners also receive an Affiliate Reward equal to 20%
            of their
            Junior Partners' reward, including the SUPER Reward.
          </Heading6>
          <Heading6>
            Cheating rewards by autoclicks and other similar methods
            is STRICTLY PROHIBITED!
          </Heading6>
        </AutoPlaySwipeableViews>

        <div className={style.contain}>
          <div className={style.contain__item}>
            {winText &&
              <h3> You win : {winAmount} {winToken}</h3>
            }
            {minutes === 0 && seconds === 0
              ? null
              : <h1> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
            }

            <LoadingButton variant="contained"
              loading={loading}
              disabled={buttonDisable}
              onClick={handleRewardButton}>
              Get Reward
            </LoadingButton>

            <GoogleReCaptcha onVerify={onVerify} />

            <p className={style.error}>{errorMessage}</p>
            <p className={style.success}>{successMessage}</p>
          </div>
          <div className={style.contain__item}>
            <Heading6>
              Top-5
        </Heading6>
            <Table
              breakpoint={300}
              columnLabels={[
                { id: "item-wallet", label: "Wallet" },
                { id: "item-time", label: "Count rewards" },
              ]}
              data={top}
              pageSize={20}
              renderItemRow={(item) => (
                <>
                  <td>
                    {item.wallet}
                  </td>
                  <td>
                    {item.amount}
                  </td>
                </>
              )}
              hideNumberColumn
            />
          </div>
        </div>
      </GoogleReCaptchaProvider>
    </Layout.Inset>
  );
};
