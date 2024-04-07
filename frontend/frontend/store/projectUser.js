import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../src/utils/api';


export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/project/user-project', { 'Authorization': `Bearer ${token}` });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projectsUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProjects: (state, action) => {
      state.projectsUsers = action.payload;
    },
    clearProjects: (state) => {
      state.projectsUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectsUsers = action.payload; 
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { setProjects, clearProjects } = projectSlice.actions;

export default projectSlice.reducer;
