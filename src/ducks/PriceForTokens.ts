import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPriceXlm } from "helpers/getXlmPrice";
import {
  QADSAN_ASSET_IN_ARRAY,
  CENTUS_ASSET_IN_ARRAY,
  CENTUSX_ASSET_IN_ARRAY,
} from "../constants/settings";
import { knownTokens } from "../utils/knownTokens";

import { RootState } from "../config/store";
import {
  getPriceTokens,
  getPriceTokensForQADSAN,
} from "../helpers/getPriceForTokens";
import { ActionStatus, IPriceResponse } from "../types/types.d";

const filterQadsanTokens = knownTokens.filter(
  (item) => item.type === "QADSAN Token",
);

export const priceForTokens = createAsyncThunk(
  "getPriceForTokens/getPriceTokens",
  async () => {
    let priceArray: IPriceResponse = { n: "", d: "0" };
    let priceArrayForCENTUS: IPriceResponse = { n: "", d: "0" };
    let priceArrayForCENTUSX: IPriceResponse = { n: "", d: "0" };
    const priceArraysTokens: any = [];
    try {
      priceArray = await getPriceTokens(QADSAN_ASSET_IN_ARRAY);
      priceArrayForCENTUS = await getPriceTokens(CENTUS_ASSET_IN_ARRAY);
      priceArrayForCENTUSX = await getPriceTokens(CENTUSX_ASSET_IN_ARRAY);

      // eslint-disable-next-line no-restricted-syntax
      for (const item of filterQadsanTokens) {
        // eslint-disable-next-line no-await-in-loop
        const res = await getPriceTokensForQADSAN(item.name, item.issuer);
        const priceToken = Number(res.n) / Number(res.d);
        priceArraysTokens.push({ name: item.asset, price: priceToken });
      }
    } catch (error) {
      console.error(error);
    }

    const priceInXLM = Number(priceArray.n) / Number(priceArray.d);
    const priceInXlmCENTUS =
      Number(priceArrayForCENTUS.n) / Number(priceArrayForCENTUS.d);
    const priceInXlmCENTUSX =
      Number(priceArrayForCENTUSX.n) / Number(priceArrayForCENTUSX.d);
    const priceXLM: number = await getPriceXlm();
    const priceInDoll = (priceInXLM * priceXLM).toFixed(7);
    const priceInDollCENTUS = (priceInXlmCENTUS * priceXLM).toFixed(7);
    const priceInDollCENTUX = (priceInXlmCENTUSX * priceXLM).toFixed(7);
    const price: number = Number(priceInDoll);
    const priceCENTUS: number = Number(priceInDollCENTUS);
    const priceCENTUSX: number = Number(priceInDollCENTUX);
    return {
      price,
      priceCENTUS,
      priceCENTUSX,
      priceXLM,
      priceArraysTokens,
    };
  },
);

type initialPriceForTokensState = {
  status: string;
  QADSAN: {
    price: number;
  };
  CENTUS: {
    price: number;
  };
  CENTUSX: {
    price: number;
  };
  XLM: {
    price: number;
  };
  Tokens: any;
};

const initialPriceForTokens: initialPriceForTokensState = {
  QADSAN: {
    price: 0,
  },
  CENTUS: {
    price: 0,
  },
  CENTUSX: {
    price: 0,
  },
  XLM: {
    price: 0,
  },
  Tokens: {},
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
      state.CENTUS.price = action.payload.priceCENTUS;
      state.CENTUSX.price = action.payload.priceCENTUSX;
      state.XLM.price = action.payload.priceXLM;
      state.Tokens = action.payload.priceArraysTokens;
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
