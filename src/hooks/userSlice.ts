import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserState } from '../types/types';

const userData = localStorage.getItem('user');
const storedUser: Partial<UserState> | null = userData ? JSON.parse(userData) : null;

const initialState: UserState = storedUser
  ? {
      username: storedUser.username || '',
      email: storedUser.email || '',
      password: '',
      isRegistered: true,
    }
  : {
      username: '',
      email: '',
      password: '',
      isRegistered: false,
    };

const updateUserStorage = (state: UserState) => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      username: state.username,
      email: state.email,
      password: state.password,
      isRegistered: state.isRegistered,
    })
  );
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    register: (
      state: UserState,
      action: PayloadAction<{ username: string; email: string; password: string }>
    ) => {
      const { username, email, password } = action.payload;
      state.username = username;
      state.email = email;
      state.password = password;
      state.isRegistered = true;
      updateUserStorage(state);
    },
    logout: (state: UserState) => {
      state.username = '';
      state.email = '';
      state.password = '';
      state.isRegistered = false;
      localStorage.removeItem('user');
    },
    getUser: (state: UserState) : UserState => {
      return state;
    },
  },
});

export const { register, logout } = userSlice.actions;
export default userSlice.reducer;
