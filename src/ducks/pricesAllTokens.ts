import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../config/store";
import { getPriceTokensAll } from "../helpers/getPriceAllTokens";
import { ActionStatus } from "../types/types.d";


export const getPriceForAllTokens = createAsyncThunk(
  "pricesAllTokens/getPriceForAllTokens",
  async () => {
    let TokensAll: any = [];
    try {
      TokensAll = await getPriceTokensAll();
    } catch (error) {
      console.error(error);
    }
    return {
      TokensAll,
    };
  },
);

type initialPriceForTokensAllState = {
  data: any;
  status: string;
};

const initialPriceForTokensAll: initialPriceForTokensAllState = {
  data: {},
  status: "",
};

export const priceForTokensAllSlice = createSlice({
  name: "pricesAllTokens",
  initialState: initialPriceForTokensAll,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPriceForAllTokens.pending, (state) => {
      state.status = ActionStatus.PENDING;
    });
    builder.addCase(getPriceForAllTokens.fulfilled, (state, action) => {
      state.data = action.payload.TokensAll;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(getPriceForAllTokens.rejected, (state) => {
      state.status = ActionStatus.ERROR;
    });
  },
});

export const pricesTokensSelector = (state: RootState) =>
  state.priceAllTokens;

export const { reducer } = priceForTokensAllSlice;
