/**
 * Providers Redux Slice
 * Manages service providers data and search
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

export const fetchProviders = createAsyncThunk(
  'providers/fetchProviders',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await apiService.searchProviders(searchParams);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch providers');
    }
  }
);

const initialState = {
  providers: [],
  searchResults: [],
  filters: {
    category: '',
    location: '',
    priceRange: [0, 1000],
    rating: 0,
    availability: '',
  },
  isLoading: false,
  error: null,
};

const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    clearProvidersError: (state) => {
      state.error = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProvidersError, updateFilters, clearSearchResults } = providersSlice.actions;
export default providersSlice.reducer;