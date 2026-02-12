import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async () => {
    const data = await productApi.getAll();
    return data;
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id) => {
    const data = await productApi.get(id);
    return data;
  }
);

export const addNewProduct = createAsyncThunk(
  'products/addNewProduct',
  async (productData) => {
    // Backend expects JSON with base64 image
    const data = await productApi.add(productData);
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }) => {
    const result = await productApi.update(id, data);
    return result;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await productApi.delete(id);
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
