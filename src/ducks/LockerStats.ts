import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { settingsSelector } from "ducks/settings";
import StellarSdk from "stellar-sdk";
import { RootState } from "config/store";
import { getClaimableBalancesStats } from "../helpers/getLockerStats";
import {
  ActionStatus,
  ClaimableBalanceStats,
  initialClaimableStatsBalancesState,
  RejectMessage,
} from "../types/types.d";
import { getNetworkConfig } from "../helpers/getNetworkConfig";
import { getErrorString } from "../helpers/getErrorString";

export const getLockerStats = createAsyncThunk<
  {
    data: ClaimableBalanceStats[];
  },
  string,
  { rejectValue: RejectMessage; state: RootState }
>(
  "LockerStats/getLockerStats",
  async (sponsors, { rejectWithValue, getState }) => {
    const { isTestnet } = settingsSelector(getState());
    const networkConfig = getNetworkConfig(isTestnet);
    const server = new StellarSdk.Server(networkConfig.url);

    let data: ClaimableBalanceStats[] = [];

    try {
      data = await getClaimableBalancesStats({ server, sponsors });
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
