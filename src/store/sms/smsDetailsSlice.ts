import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ParameterizedDataType } from '../../types/smsTypes';

interface SmsDetailsState {
  data: ParameterizedDataType[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

const initialState: SmsDetailsState = {
  data: [],
  loading: false,
  error: null,
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 0
};

export const fetchSmsDetails = createAsyncThunk(
  'smsDetails/fetchSmsDetails',
  async ({ page, size }: { page: number; size: number }) => {
    const response = await axios.get(`http://localhost:8080/api/v1/sms_details?page=${page}&size=${size}`);
    return response.data;
  }
);

const smsDetailsSlice = createSlice({
  name: 'smsDetails',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSmsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSmsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchSmsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sms details';
      });
  },
});

export const { setPage, setSize } = smsDetailsSlice.actions;
export default smsDetailsSlice.reducer;