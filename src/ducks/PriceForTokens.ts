import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPriceXlm } from "helpers/getXlmPrice";
import { RootState } from "../config/store";
import { getPriceTokens } from "../helpers/getPriceForTokens";
import { ActionStatus, IPriceResponse } from "../types/types.d";

export const priceForTokens = createAsyncThunk(
  "getPriceForTokens/getPriceTokens",
  async () => {
    let priceArray: IPriceResponse = { n: "", d: "0" };

    try {
      priceArray = await getPriceTokens();
    } catch (error) {
      console.error(error);
    }
    const priceInXLM = Number(priceArray.n) / Number(priceArray.d);
    const priceXLM: number = await getPriceXlm();
    const priceInDoll = (priceInXLM * priceXLM).toFixed(6);
    const price: number = Number(priceInDoll);
    return {
      price,
      priceXLM,
    };
  },
);

type initialPriceForTokensState = {
  status: string;
  QADSAN: {
    price: number;
  };
  XLM: {
    price: number;
  };
};

const initialPriceForTokens: initialPriceForTokensState = {
  QADSAN: {
    price: 0,
  },
  XLM: {
    price: 0,
  },
  status: "",
};

export const priceForTokensSlice = createSlice({
  name: "prices",
  initialState: initialPriceForTokens,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(priceForTokens.pending, (state) => {
      state.status = ActionStatus.PENDING;
    });
    builder.addCase(priceForTokens.fulfilled, (state, action) => {
      state.QADSAN.price = action.payload.price;
      state.XLM.price = action.payload.priceXLM;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(priceForTokens.rejected, (state) => {
      state.status = ActionStatus.ERROR;
    });
  },
});

export const claimableBalancesStatsSelector = (state: RootState) =>
  state.prices;

export const { reducer } = priceForTokensSlice;
