import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeApi from '../../api/storeApi';

export const getAllStores = createAsyncThunk(
  'stores/getAllStores',
  async () => {
    const data = await storeApi.getAll();
    return data;
  }
);

export const createStore = createAsyncThunk(
  'stores/createStore',
  async (data) => {
    const result = await storeApi.add(data);
    return result;
  }
);

export const updateStore = createAsyncThunk(
  'stores/updateStore',
  async ({ id, data }) => {
    const result = await storeApi.update(id, data);
    return result;
  }
);

export const deleteStore = createAsyncThunk(
  'stores/deleteStore',
  async (id) => {
    await storeApi.delete(id);
    return id;
  }
);

const storeSlice = createSlice({
  name: 'stores',
  initialState: {
    stores: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.data || action.payload;
      })
      .addCase(getAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        // Ideally we should append or re-fetch.
        // If payload.data is the new store:
        if (action.payload.data && !Array.isArray(action.payload.data)) {
          state.stores.push(action.payload.data);
        } else if (Array.isArray(action.payload.data)) {
          state.stores = action.payload.data;
        }
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = false;
        const updatedStore = action.payload.data;
        const index = state.stores.findIndex(s => s._id === updatedStore._id);
        if (index !== -1) {
          state.stores[index] = updatedStore;
        }
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = state.stores.filter(s => s._id !== action.payload);
      });
  }
});

export default storeSlice.reducer;
