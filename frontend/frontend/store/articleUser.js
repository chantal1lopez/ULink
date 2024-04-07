import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../src/utils/api';


export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/article/user-articles', { 'Authorization': `Bearer ${token}` });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const articleSlice = createSlice({
  name: 'article',
  initialState: {
    articlesUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    setArticles: (state, action) => {
      state.articlesUsers = action.payload;
    },
    clearArticles: (state) => {
      state.articlesUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articlesUsers = action.payload; 
        state.loading = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { setArticles, clearArticles } = articleSlice.actions;

export default articleSlice.reducer;
