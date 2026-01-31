import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async () => {
    const response = await api.get('/products');
    return response.data;
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  }
);

export const addNewProduct = createAsyncThunk(
  'products/addNewProduct',
  async (productData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...productData, _id: `P${Date.now()}` };
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id, ...data };
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.data || action.payload;
      });
  },
});

export default productSlice.reducer;
