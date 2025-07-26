import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './../api/axios';

export const refreshSession = createAsyncThunk('auth/refresh', async () => {
  await api.get('/csrf-token');
  await api.post('/auth/refresh');
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await api.get('/csrf-token');
      const response = await api.post('/auth/login', { email, password });
      return response.data; // return something to store in `fulfilled`
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      return rejectWithValue(error);
    }
  }
);
export const logout = createAsyncThunk('auth/logout', async () => {
  await api.get('/csrf-token');
  await api.post('/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshSession.pending, (state) => { state.loading = true; })
      .addCase(refreshSession.fulfilled, (state) => {
        state.user = {};
        state.loading = false;
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // or {}
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // comes from `rejectWithValue`
      });
  }
});

export default authSlice.reducer;