import { configureStore } from '@reduxjs/toolkit';
import  eventDetailsSlice  from './event/eventDetailsSlice';

const store = configureStore({
  reducer: {
    eventDetails: eventDetailsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
