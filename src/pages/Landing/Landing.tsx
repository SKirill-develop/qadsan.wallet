import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Heading1, TextLink, Modal, Layout, Loader } from "@stellar/design-system";
import { NewKeyPairForm } from "components/NewKeyPairForm";
import { SignInAlbedoForm } from "components/SignIn/SignInAlbedoForm";
import { SignInLedgerForm } from "components/SignIn/SignInLedgerForm";
import { SignInFreighterForm } from "components/SignIn/SignInFreighterForm";
import { SignInSecretKeyForm } from "components/SignIn/SignInSecretKeyForm";
import { SignInTrezorForm } from "components/SignIn/SignInTrezorForm";
import { WalletButton } from "components/WalletButton";
import { AppDispatch } from "config/store";
import { wallets } from "constants/wallets";
import { resetAlbedoAction } from "ducks/wallet/albedo";
import { resetLedgerAction } from "ducks/wallet/ledger";
import { resetFreighterAction } from "ducks/wallet/freighter";
import { resetTrezorAction } from "ducks/wallet/trezor";
import { ModalType } from "types/types.d";
import { priceForTokens } from "../../ducks/PriceForTokens";
import { getPriceForAllTokens } from "../../ducks/pricesAllTokens";
import { addPartnerAction } from "../../ducks/account";
import { Charts } from 'components/Charts/Charts';
import { useRedux } from "hooks/useRedux";
import { Link, useLocation } from "react-router-dom";
import styles from "./Landing.module.css";


export const Landing = () => {
  const dispatch: AppDispatch = useDispatch();
  const { search } = useLocation();
  const { priceAllTokens } = useRedux("priceAllTokens");
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [loginModal, setLoginModal] = useState(false);
  const { account } = useRedux("account");
  const { isAuthenticated } = account;

  useEffect(() => {
    dispatch(priceForTokens());
    dispatch(getPriceForAllTokens());
  }, [dispatch]);

  useEffect(() => {
    if (search) {
      const partnerId = search.split('=')[1];
      dispatch(addPartnerAction(partnerId));
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
        className={styles.login__link}
      >
        <h4
          onClick={() => setLoginModal(true)}>LOGIN</h4>
      </Link>
      }
      <div className="Landing-container">
      <Heading1 className={styles.title}>
                Secure and Profitable Wallet
              </Heading1>
              <p className={styles.subtitle}>
                Earn, send, receive, and swap QADSAN token-shares easily!
              </p>
              <div className={styles.title__charts}>
                Profit from the Best QADSAN Token-shares
              </div>
        {priceAllTokens.status === "SUCCESS"
          ? <Charts /> : <Loader size="5rem" />}

        <Modal visible={loginModal} onClose={() => setLoginModal(false)}>
          <Modal.Heading>
            Login with STELLAR
          </Modal.Heading>
          <Modal.Body>
            <div className={styles.modal__body}>
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
          </Modal>
        <Modal visible={activeModal !== null} onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      </div>
    </Layout.Inset>
  );
};
