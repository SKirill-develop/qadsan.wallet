import React from "react";
import ReactDOM from "react-dom/client";
import {
  ConnectionRejectedError,
  UseWalletProvider,
} from 'use-wallet';
import {
  BscConnector,
  UserRejectedRequestError,
} from '@binance-chain/bsc-connector';
import reportWebVitals from "./reportWebVitals";
import "@stellar/design-system/build/styles.min.css";
import { App } from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <UseWalletProvider
      connectors={{
        bsc: () => {
          return {
            web3ReactConnector: () => {
              return new BscConnector({ supportedChainIds: [56] });
            },
            handleActivationError: (err: any) => {
              if (err instanceof UserRejectedRequestError) {
                return new ConnectionRejectedError();
              }
              return null;
            },
          };
        },
      }}
    >
      <App />
    </UseWalletProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
