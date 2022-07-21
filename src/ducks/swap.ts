import { createSlice } from "@reduxjs/toolkit";

type initialSwapState = {
  amount: string;
  token: {
    code: string;
    issuer: string;
  };
};

const initialSwap: initialSwapState = {
  amount: "",
  token: {
    code: '',
    issuer: '',
  },
};

export const initialSwapSlice = createSlice({
  name: "swapInfo",
  initialState: initialSwap,
  reducers: {
    resetSwapAction: () => initialSwap,
    createSwap(state, action) {
      state.amount = action.payload.amount;
      state.token.code = action.payload.token.code;
      state.token.issuer = action.payload.token.issuer;
    },
  },
});
const { actions } = initialSwapSlice;
export const {
  createSwap,
} = actions;
export const { reducer } = initialSwapSlice;
