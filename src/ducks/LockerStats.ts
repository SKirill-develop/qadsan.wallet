import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";
import { RootState } from "config/store";
import { settingsSelector } from "ducks/settings";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { getClaimableBalancesStats } from "../helpers/getLockerStats";
import { getErrorString } from "../helpers/getErrorString";
import {
  ActionStatus,
  ClaimableBalanceStats,
  initialClaimableStatsBalancesState,
  RejectMessage,
} from "../types/types.d";

export const getLockerStats = createAsyncThunk<
  {
    data: ClaimableBalanceStats[];
  },
  string,
  {
    rejectValue: RejectMessage;
    state: RootState;
  }
>(
  "LockerStats/getLockerStats",
  async (wallet, { rejectWithValue, getState }) => {
    const { isTestnet } = settingsSelector(getState());
    const networkConfig = getNetworkConfig(isTestnet);
    const server = new StellarSdk.Server(networkConfig.url);

    let data: ClaimableBalanceStats[] = [];

    try {
      data = await getClaimableBalancesStats({ server, wallet });
    } catch (error) {
      return rejectWithValue({
        errorString: getErrorString(error),
      });
    }

    return {
      data,
    };
  },
);

const initialClaimableStatsBalances: initialClaimableStatsBalancesState = {
  data: [],
  status: undefined,
  errorString: undefined,
};

export const claimableStatsBalancesSlice = createSlice({
  name: "claimableBalancesStats",
  initialState: initialClaimableStatsBalances,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLockerStats.pending, (state) => {
      state.status = ActionStatus.PENDING;
      state.errorString = undefined;
    });
    builder.addCase(getLockerStats.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(getLockerStats.rejected, (state, action) => {
      state.status = ActionStatus.ERROR;
      state.errorString = action.payload?.errorString;
    });
  },
});

export const claimableBalancesStatsSelector = (state: RootState) =>
  state.claimableBalancesStats;

export const { reducer } = claimableStatsBalancesSlice;
