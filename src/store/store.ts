import { configureStore } from '@reduxjs/toolkit';
import  smsDetailsSlice  from './sms/smsDetailsSlice';

const store = configureStore({
  reducer: {
    smsDetails: smsDetailsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
