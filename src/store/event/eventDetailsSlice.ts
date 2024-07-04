import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {EventType, FilterRequest, Status} from '../../types/eventTypes';

interface EventDetailsState {
  data: EventType[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

const initialState: EventDetailsState = {
  data: [],
  loading: false,
  error: null,
  page: 0,
  size: 25,
  totalPages: 1,
  totalElements: 0
};

export const fetchEventDetails = createAsyncThunk(
    'eventDetails/fetchEventDetails',
    async (request: FilterRequest) => {
      let queryParams = `?page=${request.page}&size=${request.size}`;

      if (request.dateRange &&request.dateRange[1] !== null) {
        queryParams += `&dateBefore=${request.dateRange[1].toISOString()}`;
      }
      if (request.dateRange&&request.dateRange[0] !== null) {
        queryParams += `&dateAfter=${request.dateRange[0].toISOString()}`;
      }
      if (request.msisdn !== undefined) {
        queryParams += `&msisdn=${request.msisdn}`;
      }
      if (request.apiIdentifier !== undefined) {
        queryParams += `&apiIdentifier=${request.apiIdentifier}`;
      }
      if (request.recipientEmailAddress !== undefined) {
        queryParams += `&recipientEmail=${request.recipientEmailAddress}`;
      }
      if (request.adviseStatus !== null) {
        queryParams += `&adviseStatus=${request.adviseStatus}`;
      }
      if (request.useCase !== undefined) {
        queryParams += `&useCase=${request.useCase}`;
      }

      const response = await axios.get(`http://localhost:8080/api/v1/event_details${queryParams}`);
      return response.data;
    }
);

const eventDetailsSlice = createSlice({
  name: 'eventDetails',
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
        .addCase(fetchEventDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchEventDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload.content;
          state.totalPages = action.payload.totalPages;
          state.totalElements = action.payload.totalElements;
        })
        .addCase(fetchEventDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch event details';
        });
  },
});

export const { setPage, setSize } = eventDetailsSlice.actions;
export default eventDetailsSlice.reducer;