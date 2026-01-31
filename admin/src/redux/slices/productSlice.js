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
    // Backend expects JSON with base64 image
    const response = await api.post('/product/new', productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }) => {
    const response = await api.put(`/product/update/${id}`, data);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await api.delete(`/product/delete/${id}`);
    return id;
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
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
            state.products = action.payload.data;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
