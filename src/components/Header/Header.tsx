import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  const { isAuthenticated } = account;

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

  const isSignedIn = isAuthenticated && account.data;
  const onSignOut = isSignedIn ? handleSignOut : undefined;
  const { pathname } = useLocation();

  return (
    <Layout.Content>
      <Layout.Inset>
        <div className={styles.header}>
          <Link to="/">
            <HeaderLogo />
          </Link>
          {isSignedIn ? (
            <div className={styles.header__account}>
              <CopyText textToCopy={account.data!.id} showTooltip>
                <button className={styles.copyIdenticon}>
                  <Identicon publicAddress={account.data!.id} shortenAddress />
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
          {isSignedIn && pathname !== "/dashboard" ? (
            <Link to="/dashboard" className={styles.header__nav__item}>
              <p>Back to Wallet</p>
            </Link>
          ) : undefined}

          <TextLink disabled variant={TextLink.variant.secondary}>
            Airdrop
          </TextLink>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};
