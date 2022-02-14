import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Layout, Identicon, CopyText, TextLink, ToggleDarkMode, ModeValue } from "@stellar/design-system";

import { resetStoreAction } from "config/store";
import { stopAccountWatcherAction } from "ducks/account";
import { stopTxHistoryWatcherAction } from "ducks/txHistory";
import { useRedux } from "hooks/useRedux";
import { getUserThemeSettings } from "helpers/getUserThemeSettings";
import { logEvent } from "helpers/tracking";
import { HeaderLogo } from "./HeaderLogo/HeaderLogo";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useRedux("account");
  const { isAuthenticated } = account;

  const getThemeTrackingParams = (isDarkMode?: boolean) => {
    const { prefersDarkMode, savedMode } = getUserThemeSettings(isDarkMode);

    return {
      "using system dark mode": Boolean(prefersDarkMode),
      "user set website theme": savedMode ?? "not set",
    };
  };

  useEffect(() => {
    logEvent("theme: initial page load", getThemeTrackingParams());
  }, []);

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
        <div className="header">
          <Link to="/">
            <HeaderLogo />
          </Link>
          {isSignedIn ? (
            <div className="Header__account">
              <CopyText textToCopy={account.data!.id} showCopyIcon showTooltip>
                <Identicon publicAddress={account.data!.id} shortenAddress />
              </CopyText>
            </div>
          ) : undefined}
        <div className="theme_contain">
          {onSignOut ? (
            <TextLink id="sign-out-button" role="button" onClick={onSignOut} className="sign-out">
              Sign out
            </TextLink>
          ) : null}

          {hasDarkModeToggle ? (
            <ToggleDarkMode
              storageKeyId={`QADSANTheme:`}
              showBorder={true}
            />
          ) : null}
          </div>
        </div>
        {isSignedIn && pathname !== '/dashboard' ? (
          <Link to="/dashboard" className="link__wallet"> 
            <p>Go to Wallet</p>
          </Link>
        ): undefined}
      </Layout.Inset>
    </Layout.Content>
  );
};
