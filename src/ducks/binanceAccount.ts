import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ActionStatus } from "../types/types.d";
import { knownTokens } from "../utils/knownTokens";
import { getTransactionsForBinance } from 'utils/binance';
import Web3 from "web3";
import { RootState } from "config/store";

const qadsanFilter = knownTokens.filter(
  (item) => item.type === "QADSAN" || item.typeBinance,
);

export const getBalancesBinance = createAsyncThunk<
  {
    TokensAll: any;
    transactions: any;
    bnbPrice: any;
  },
  string,
  { state: RootState }
>("binanceAccount/getBalancesBinance", async (wallet) => {
  const TokensAll: any = [];

  const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

  const getBalance = async (
    abis: any,
    contractAddress: string,
    name: string,
  ) => {
    const contract = new web3.eth.Contract(abis, contractAddress);
    await contract.methods
      .balanceOf(wallet)
      .call()
      .then((res: any) => {
        TokensAll.push({ name, amount: res });
      });
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const asset of qadsanFilter) {
    // eslint-disable-next-line no-await-in-loop
    await getBalance(asset.abi, asset.contract, asset.name);
  }

  const bnbPrice = await
  fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDC')
  .then(res => res.json())
  .catch((err) => console.error(err));

  const transactions = await getTransactionsForBinance(wallet);
  return {
    TokensAll,
    transactions,
    bnbPrice,
  };
});

type initialBinanceAccountState = {
  wallet: string;
  bnbPrice: number;
  tokens: any;
  transactions: any;
  status: string;
  balance: string;
  auth: boolean;
  openModal: boolean;
};

const initialBinanceAccount: initialBinanceAccountState = {
  wallet: "",
  bnbPrice: 0,
  tokens: [],
  transactions: {},
  status: "",
  balance: "0",
  auth: false,
  openModal: false,
};

export const initialBinanceAccountSlice = createSlice({
  name: "binanceAccount",
  initialState: initialBinanceAccount,
  reducers: {
    resetAccountAction: () => initialBinanceAccount,
    createAccountAction(state, action) {
      state.wallet = action.payload.account;
      state.balance = action.payload.balance;
      state.auth = true;
    },
    setTokensAction(state, action) {
      state.tokens = action.payload.result;
    },
    setModalAction(state, action) {
      state.openModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBalancesBinance.pending, (state) => {
      state.status = ActionStatus.PENDING;
    });
    builder.addCase(getBalancesBinance.fulfilled, (state, action) => {
      state.tokens = action.payload.TokensAll;
      state.transactions = action.payload.transactions;
      state.bnbPrice = Number(action.payload.bnbPrice.price);
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(getBalancesBinance.rejected, (state) => {
      state.status = ActionStatus.ERROR;
    });
  },
});

export const accountSelector = (state: RootState) => state.account;

export const { reducer } = initialBinanceAccountSlice;

export const { createAccountAction, setTokensAction, setModalAction } =
  initialBinanceAccountSlice.actions;
