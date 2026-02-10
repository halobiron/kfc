import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Async Thunks
export const getAllProducts = createAsyncThunk(
    'products/getAllProducts',
    async () => {
        const response = await axiosClient.get('/products');
        return response.data.data;
    }
);

export const getProductById = createAsyncThunk(
    'products/getProductById',
    async (id) => {
        const response = await axiosClient.get(`/product/${id}`);
        return response.data.data;
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
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload || [];
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectProductLoading = (state) => state.products.loading;
export const selectProductError = (state) => state.products.error;
export const selectCurrentProduct = (state) => state.products.currentProduct;

export default productSlice.reducer;
