import { RootState } from '../../store/store';

export const selectSmsDetails = (state: RootState) => state.smsDetails.data;
export const selectSmsDetailsLoading = (state: RootState) => state.smsDetails.loading;
export const selectSmsDetailsTotalElements = (state: RootState) => state.smsDetails.totalElements;
export const selectSmsDetailsError = (state: RootState) => state.smsDetails.error;
export const selectSmsDetailsPage = (state: RootState) => state.smsDetails.page;
export const selectSmsDetailsSize = (state: RootState) => state.smsDetails.size;
export const selectSmsDetailsTotalPages = (state: RootState) => state.smsDetails.totalPages;
