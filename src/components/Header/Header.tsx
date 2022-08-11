import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import { AppDispatch } from "config/store";
import {
  Layout,
  Identicon,
  CopyText,
  TextLink,
  ToggleDarkMode,
  ModeValue,
  Icon,
} from "@stellar/design-system";

import { resetStoreAction } from "../../config/store";
import { stopAccountWatcherAction } from "../../ducks/account";
import { stopTxHistoryWatcherAction } from "../../ducks/txHistory";
import { useRedux } from "../../hooks/useRedux";
import styles from "./Header.module.scss";
import { HeaderLogo } from "../HeaderLogo/HeaderLogo";

export const Header = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useRedux("account");
  const { binanceAccount } = useRedux("binanceAccount");
  const { isAuthenticated } = account;
  const { auth } = binanceAccount;
  const { pathname } = useLocation();
  const blockchain = account.isAuthenticated ?
    '/stellar/dashboard' :
    '/binance/dashboard';

  const handleSignOut = () => {
    dispatch(stopAccountWatcherAction());
    dispatch(stopTxHistoryWatcherAction());
    dispatch(resetStoreAction());
    navigate("/");
  };
  const [hasDarkModeToggle] = useState(true);

  useEffect(() => {
    if (!hasDarkModeToggle) {
      document.body.classList.add(ModeValue.light);
    }
  }, [hasDarkModeToggle]);

  const isSignedInStellar = isAuthenticated && account.data;
  const isSignedInBinance = auth && binanceAccount.wallet;
  const onSignOut = isSignedInStellar
    || isSignedInBinance ? handleSignOut : undefined;

  return (
    <header>
      <Layout.Content>
        <Layout.Inset>
          <div className={styles.header}>
            <Link to="/">
              <HeaderLogo />
            </Link>
            {isSignedInStellar ? (
              <div className={styles.header__account}>
                <CopyText textToCopy={account.data!.id} showTooltip>
                  <button className={styles.copyIdenticon}>
                    <Identicon publicAddress={account.data!.id}
                      shortenAddress />
                    <Icon.Copy />
                  </button>
                </CopyText>
              </div>
            ) : undefined}
            {isSignedInBinance ? (
              <div className={styles.header__account}>
                <CopyText textToCopy={binanceAccount.wallet} showTooltip>
                  <button className={styles.copyIdenticon}>
                    <Identicon
                      publicAddress={binanceAccount.wallet}
                      shortenAddress />
                    <Icon.Copy />
                  </button>
                </CopyText>
              </div>
            ) : undefined}
            <div className={styles.theme_contain}>
              {onSignOut ? (
                <TextLink
                  id="sign-out-button"
                  role="button"
                  onClick={onSignOut}
                  className={styles.sign_out}
                >
                  Sign out
                </TextLink>
              ) : null}

              {hasDarkModeToggle ? (
                <ToggleDarkMode storageKeyId="QADSANTheme:" showBorder={true} />
              ) : null}
            </div>
          </div>
          <div className={styles.header__nav}>
            <div className={styles.header__nav__items}>
              {(isSignedInStellar ||
                isSignedInBinance) && pathname !== blockchain ? (
                <Link to={blockchain} className={styles.header__nav__item}>
                  <p>Back to Wallet</p>
                </Link>
              ) : undefined}
              <NewReleasesRoundedIcon color='primary' />
              <TextLink
                variant={TextLink.variant.secondary}
                href="https://qadsan.medium.com/qadsan-token-shares-airdrop-to-stellar-xlm-holders-e383a35f278e">
                Airdrop
          </TextLink>
            </div>
          </div>
        </Layout.Inset>
      </Layout.Content>
    </header>
  );
};
