import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budgetSlice';
import accountsReducer from './accountsSlice';

export const store = configureStore({
  reducer: {
    budget: budgetReducer,
    accounts: accountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 