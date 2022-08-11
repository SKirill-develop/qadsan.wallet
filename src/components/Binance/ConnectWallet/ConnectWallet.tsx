import { useWallet } from 'use-wallet';
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "config/store";
import {
  createAccountAction,
  setModalAction,
} from "ducks/binanceAccount";
import MetamaskLogo from '../../../assets/logo/metamask-logo.png';
import BinanceLogo from '../../../assets/logo/Binance-BNB-Icon-Logo.png';
import Button from '@mui/material/Button';
import style from './ConnectWallet.module.css';
import { ModalPageProps } from "types/types.d";

export const ConnectWallet = ({ onClose }: ModalPageProps) => {
  const wallet = useWallet();
  const { account, connect, status, balance } = wallet;
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status === 'connected') {
      dispatch(createAccountAction({
        account,
        balance,
      }));
      navigate({
        pathname: "/binance/dashboard",
        search: location.search,
      });
      dispatch(setModalAction(false));
    }
  }, [status]);


  return (
    <div>
      <div
        className={style.connectButton}
        onClick={() => connect()}
      >
        <img
          className={style.logo}
          src={MetamaskLogo}
          alt="MetaMask"
        />
          Connect with MetaMask
      </div>

      <div
        className={style.connectButton}
        onClick={() => connect('bsc')}>
        <img
          className={style.logo__binance}
          src={BinanceLogo}
          alt="Binance"
        />
          Connect with Binance
      </div>
      <Button variant="outlined" onClick={onClose} >
        Cancel
      </Button>
    </div>

  );
};