import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../src/utils/api'; 

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/user/profile', { 'Authorization': `Bearer ${token}` });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    loading: false, // Agrega estados para cargar y errores
    error: null,
  },
  reducers: {
    // Tus reducers existentes aquí
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// Acciones exportadas
export const { setUserInfo, clearUserInfo } = userSlice.actions;

// El reducer exportado
export default userSlice.reducer;
