import { RootState } from '../store';

export const selectEvents = (state: RootState) => state.eventDetails.data;
export const selectEventsLoading = (state: RootState) => state.eventDetails.loading;
export const selectEventsTotalElements = (state: RootState) => state.eventDetails.totalElements;
export const selectEventsError = (state: RootState) => state.eventDetails.error;
