import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeApi from '../../api/storeApi';

// 1. Get All
export const getAllStores = createAsyncThunk(
  'stores/getAllStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeApi.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Create
export const createStore = createAsyncThunk(
  'stores/createStore',
  async (data, { rejectWithValue }) => {
    try {
      const response = await storeApi.add(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. Update
export const updateStore = createAsyncThunk(
  'stores/updateStore',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await storeApi.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4. Delete
export const deleteStore = createAsyncThunk(
  'stores/deleteStore',
  async (id, { rejectWithValue }) => {
    try {
      await storeApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const storeSlice = createSlice({
  name: 'stores',
  initialState: {
    stores: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- GET ALL ---
      .addCase(getAllStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.stores || action.payload.data || action.payload || []; 
      })
      .addCase(getAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // --- CREATE ---
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        const newStore = action.payload.store || action.payload.data || action.payload;
        if (newStore && !Array.isArray(newStore)) {
            state.stores.push(newStore);
        }
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // --- UPDATE ---
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStore = action.payload.store || action.payload.data || action.payload;
        
        if (updatedStore && updatedStore._id) {
             const index = state.stores.findIndex((s) => s._id === updatedStore._id);
             if (index !== -1) {
               state.stores[index] = updatedStore;
             }
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // --- DELETE ---
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.stores = state.stores.filter((s) => s._id !== id);
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = storeSlice.actions;
export default storeSlice.reducer;
