import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from "react-redux";
import { Heading1, TextLink, Modal, Layout, Loader } from "@stellar/design-system";
import { NewKeyPairForm } from "components/NewKeyPairForm";
import { SignInAlbedoForm } from "components/SignIn/SignInAlbedoForm";
import { SignInLedgerForm } from "components/SignIn/SignInLedgerForm";
import { SignInFreighterForm } from "components/SignIn/SignInFreighterForm";
import { SignInSecretKeyForm } from "components/SignIn/SignInSecretKeyForm";
import { SignInTrezorForm } from "components/SignIn/SignInTrezorForm";
import { ConnectWallet } from "components/Binance/ConnectWallet/ConnectWallet";
import { WalletButton } from "components/WalletButton";
import { AppDispatch } from "config/store";
import { wallets } from "constants/wallets";
import { resetAlbedoAction } from "ducks/wallet/albedo";
import { resetLedgerAction } from "ducks/wallet/ledger";
import { resetFreighterAction } from "ducks/wallet/freighter";
import { resetTrezorAction } from "ducks/wallet/trezor";
import { ModalType } from "types/types.d";
import { priceForTokens } from "ducks/PriceForTokens";
import { getPriceForAllTokens } from "ducks/pricesAllTokens";
import { addPartnerAction } from "ducks/account";
import { Charts } from 'components/Charts/Charts';
import { useRedux } from "hooks/useRedux";
import { setModalAction } from "ducks/binanceAccount";
import { Link, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import binanceLogo from '../../assets/logo/binance-logo.webp';
import stellarLogo from '../../assets/logo/stellar-logo.png';
import solanaLogo from '../../assets/logo/solana-logo.png';
import style from "./Landing.module.css";


export const Landing = () => {
  const dispatch: AppDispatch = useDispatch();
  const { search } = useLocation();
  const { priceAllTokens } = useRedux("priceAllTokens");
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [loginModal, setLoginModal] = useState(false);
  const [blockchain, setBlockchain] = useState('');
  const { account } = useRedux("account");
  const { binanceAccount } = useRedux("binanceAccount");
  const { isAuthenticated } = account;

  useMemo(() => {
    dispatch(priceForTokens());
    dispatch(getPriceForAllTokens());
  }, [account, dispatch]);

  useEffect(() => {
    if (search) {
      if (search.split('=')[0] === '?partner') {
        const partnerId = search.split('=')[1];
        dispatch(addPartnerAction(partnerId));
      }
    }
  }, [search]);

  const resetWalletState = (type: ModalType | null) => {
    switch (type) {
      case ModalType.SIGNIN_TREZOR:
        dispatch(resetTrezorAction());
        break;
      case ModalType.SIGNIN_LEDGER:
        dispatch(resetLedgerAction());
        break;
      case ModalType.SIGNIN_FREIGHTER:
        dispatch(resetFreighterAction());
        break;
      case ModalType.SIGNIN_ALBEDO:
        dispatch(resetAlbedoAction());
        break;
      default:
    }
  };

  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    resetWalletState(activeModal);
    setBlockchain("");
    setLoginModal(false);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case ModalType.SIGNIN_SECRET_KEY:
        return <SignInSecretKeyForm onClose={closeModal} />;
      case ModalType.SIGNIN_TREZOR:
        return <SignInTrezorForm onClose={closeModal} />;
      case ModalType.SIGNIN_LEDGER:
        return <SignInLedgerForm onClose={closeModal} />;
      case ModalType.SIGNIN_FREIGHTER:
        return <SignInFreighterForm onClose={closeModal} />;
      case ModalType.SIGNIN_ALBEDO:
        return <SignInAlbedoForm onClose={closeModal} />;
      case ModalType.NEW_KEY_PAIR:
        return <NewKeyPairForm onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <Layout.Inset>
      {!isAuthenticated && !account.data && <Link to="/"
        className={style.login__link}
      >
        <h4
          onClick={() => setLoginModal(true)}>
          Connect wallet
        </h4>
      </Link>
      }
      <div className="Landing-container">
        <Heading1 className={style.title}>
          Secure and Profitable Wallet
              </Heading1>
        <p className={style.subtitle}>
          Earn, send, receive and swap QADSAN token-shares easily!
              </p>
        <div className={style.title__charts}>
          Profit from the Best QADSAN Token-shares
              </div>
        {priceAllTokens.status === "SUCCESS" && priceAllTokens.data.ELGOOG
          ? <Charts /> : <Loader size="5rem" />}

        <Modal visible={loginModal} onClose={closeModal}>
          <Modal.Heading>
            Select blockchain
          </Modal.Heading>
          <Modal.Body>
            <div className={style.modal__blockchain}>
              <div
                className={style.modal__blockchain__button}
                onClick={() => dispatch(setModalAction(true))}>
                <img
                  className={style.modal__blockchain__logo}
                  src={binanceLogo}
                  alt="BINANCE logo" />
                    BNB CHAIN
              </div>
              <Tooltip
                title="Soon"
                placement="top"
              >
                <div className={style.modal__blockchain__button}>
                  <img
                    className={style.modal__blockchain__logo}
                    src={solanaLogo}
                    alt="SOLANA logo" />
                    SOLANA
                </div>
              </Tooltip>
              <div
                className={style.modal__blockchain__button}
                onClick={() => setBlockchain("STELLAR")}>
                <img
                  className={style.modal__blockchain__logo}
                  src={stellarLogo}
                  alt="STELLAR logo" />
                    STELLAR
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal visible={activeModal !== null} onClose={closeModal}>
          {renderModalContent()}
        </Modal>
        <Modal visible={binanceAccount.openModal}
          onClose={closeModal}
          // disableWindowScrollWhenOpened={false}
          >
          <Modal.Body>
            <ConnectWallet onClose={closeModal}/>
          </Modal.Body>
        </Modal>
        <Modal visible={blockchain === "STELLAR"} onClose={closeModal}>
          <Modal.Body>
            <div className={style.modal__body}>
              <div className="WalletButtons-container">
                {Object.keys(wallets).map((walletKey) => {
                  const wallet = wallets[walletKey];

                  return (
                    <WalletButton
                      key={walletKey}
                      onClick={() => openModal(wallet.modalType)}
                      imageSvg={wallet.logoSvg}
                      infoText={
                        <>
                          {wallet.infoText}{" "}
                          <TextLink
                            href={wallet.infoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {wallet.infoLinkText}
                          </TextLink>
                        </>
                      }
                    >
                      {wallet.title}
                    </WalletButton>
                  );
                })}
              </div>

              <div className="Landing-buttons-wrapper">
                <TextLink
                  role="button"
                  onClick={() => openModal(ModalType.SIGNIN_SECRET_KEY)}
                  variant={TextLink.variant.secondary}
                  underline
                >
                  Connect with a secret key
                    </TextLink>

                <TextLink
                  role="button"
                  onClick={() => openModal(ModalType.NEW_KEY_PAIR)}
                  variant={TextLink.variant.secondary}
                  underline
                >
                  Generate key pair for a new account
                    </TextLink>
              </div>
            </div>
          </Modal.Body>
          <Button variant="outlined" onClick={closeModal}>BACK</Button>
        </Modal>
      </div>
    </Layout.Inset>
  );
};
