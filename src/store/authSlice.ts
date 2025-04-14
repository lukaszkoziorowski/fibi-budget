import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/user';

interface AuthState {
  currentUser: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  loading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setUser, setLoading } = authSlice.actions;

export default authSlice.reducer; 
 
 
 
 
 
 