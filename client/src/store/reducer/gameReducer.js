// propertySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

// wingo game
export const wingoPeriodList = createAsyncThunk(
  'game/wingo-period-list',
  async ({ typeid1, pageno, pageto }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/GetNoaverageEmerdList', { typeid: typeid1, pageno: pageno, pageto: pageto }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const wingoBet = createAsyncThunk(
  'game/wingo-bet',
  async ({ typeid1, selectBet, balance, multiplier }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/action/join', { typeid: typeid1, join: selectBet, x: multiplier, money: balance }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const wingoHistory = createAsyncThunk(
  'game/wingo-history',
  async ({ typeid1, pageno, pageto }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/GetMyEmerdList', { typeid: typeid1, pageno: pageno, pageto: pageto }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// k3 game
export const k3PeriodList = createAsyncThunk(
  'game/k3-period-list',
  async ({ typeid1, pageno, pageto }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/k3/GetNoaverageEmerdList', { gameJoin: typeid1, pageno: pageno, pageto: pageto }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const k3Bet = createAsyncThunk(
  'game/k3-bet',
  async ({ typeid1, selectTab, selectBet, totalbalance, multiplier }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/action/k3/join', { game: typeid1, listJoin: selectBet, gameJoin: selectTab, xvalue: multiplier, money: totalbalance }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const k3History = createAsyncThunk(
  'game/k3-history',
  async ({ typeid1, pageno, pageto }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/k3/GetMyEmerdList', { gameJoin: typeid1, pageno: pageno, pageto: pageto }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 5d game
export const d5PeriodList = createAsyncThunk(
  'game/5d-period-list',
  async ({ typeid1, pageno, pageto }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/5d/GetNoaverageEmerdList', { gameJoin: typeid1, pageno: pageno, pageto: pageto }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const d5Bet = createAsyncThunk(
  'game/d5-bet',
  async ({ typeid1, selectTab, selectBet, balance, multiplier }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/action/5d/join', { game: typeid1, list_join: selectBet, join: selectTab, x: multiplier, money: balance }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const d5History = createAsyncThunk(
  'game/d5-history',
  async ({ typeid1, pageno, pageto }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/webapi/5d/GetMyEmerdList', { gameJoin: typeid1, pageno: pageno, pageto: pageto }, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const spinhistory = createAsyncThunk(
  'game/spin-history',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/webapi/spin-history`, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ Fetch game history with filter (today, yesterday, this_week, this_month)
export const gameHistory = createAsyncThunk(
  "history/game-history",
  async ({ filter }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/webapi/historyfilter",
        { filter },
        { withCredentials: true }
      );
      console.log("datadatadatadata",data);
      
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Network error" });
    }
  }
);

export const gameReducer = createSlice({
  name: 'game',
  initialState: {
    loader: false,
    errorMessage: '',
    successMessage: '',
    wingoPeriodListData: null,
    wingoBetData: null,
    wingoHistoryData: null,
    k3PeriodListData: null,
    k3BetData: null,
    k3HistoryData: null,
    d5PeriodListData: null,
    d5BetData: null,
    d5HistoryData: null,
    spinhistoryData: null,
    historyData: null,
    summaryData: null,
    paginationData: null,
    historyLoader: false,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    },
    game_reset: (state) => {
      state.wingoPeriodListData = null;
      state.k3PeriodListData = null;
      state.d5PeriodListData = null;
      state.historyData = null;
      state.summaryData = null;
      state.paginationData = null;
    },
    clearHistoryData: (state) => {
      state.historyData = null;
      state.summaryData = null;
      state.paginationData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Wingo Period List
      .addCase(wingoPeriodList.pending, (state) => {
        state.loader = true;
      })
      .addCase(wingoPeriodList.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(wingoPeriodList.fulfilled, (state, { payload }) => {
        state.wingoPeriodListData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // Wingo Bet
      .addCase(wingoBet.pending, (state) => {
        state.loader = true;
      })
      .addCase(wingoBet.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(wingoBet.fulfilled, (state, { payload }) => {
        state.wingoBetData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // Wingo History
      .addCase(wingoHistory.pending, (state) => {
        state.loader = true;
      })
      .addCase(wingoHistory.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(wingoHistory.fulfilled, (state, { payload }) => {
        state.wingoHistoryData = payload.data || payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // K3 Period List
      .addCase(k3PeriodList.pending, (state) => {
        state.loader = true;
      })
      .addCase(k3PeriodList.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(k3PeriodList.fulfilled, (state, { payload }) => {
        state.k3PeriodListData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // K3 Bet
      .addCase(k3Bet.pending, (state) => {
        state.loader = true;
      })
      .addCase(k3Bet.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(k3Bet.fulfilled, (state, { payload }) => {
        state.k3BetData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // K3 History
      .addCase(k3History.pending, (state) => {
        state.loader = true;
      })
      .addCase(k3History.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(k3History.fulfilled, (state, { payload }) => {
        state.k3HistoryData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // 5D Period List
      .addCase(d5PeriodList.pending, (state) => {
        state.loader = true;
      })
      .addCase(d5PeriodList.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(d5PeriodList.fulfilled, (state, { payload }) => {
        state.d5PeriodListData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // 5D Bet
      .addCase(d5Bet.pending, (state) => {
        state.loader = true;
      })
      .addCase(d5Bet.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(d5Bet.fulfilled, (state, { payload }) => {
        state.d5BetData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // 5D History
      .addCase(d5History.pending, (state) => {
        state.loader = true;
      })
      .addCase(d5History.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(d5History.fulfilled, (state, { payload }) => {
        state.d5HistoryData = payload;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // Spin History
      .addCase(spinhistory.pending, (state) => {
        state.loader = true;
      })
      .addCase(spinhistory.rejected, (state, { payload }) => {
        state.errorMessage = payload?.errorMessage || 'An error occurred';
        state.loader = false;
      })
      .addCase(spinhistory.fulfilled, (state, { payload }) => {
        state.spinhistoryData = payload.data;
        state.successMessage = payload.message;
        state.loader = false;
      })
      
      // Game History Filter
      .addCase(gameHistory.pending, (state) => {
        state.historyLoader = true;
        state.errorMessage = '';
      })
      .addCase(gameHistory.rejected, (state, { payload }) => {
        state.historyLoader = false;
        state.errorMessage = payload?.message || "Failed to fetch game history";
        state.historyData = null;
        state.summaryData = null;
      })
      .addCase(gameHistory.fulfilled, (state, { payload }) => {
        state.historyLoader = false;
        state.successMessage = payload.message || "History loaded successfully";
        state.historyData = payload.data || payload.history;
        state.summaryData = payload.summary;
        state.paginationData = payload.pagination;
      });
  }
});

export const { messageClear, game_reset, clearHistoryData } = gameReducer.actions;
export default gameReducer.reducer;